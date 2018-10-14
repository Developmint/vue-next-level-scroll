/* eslint-disable no-console */
import { createLocalVue, mount } from '@vue/test-utils'
import { render } from '@vue/server-test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import ScrollNextLevel from '../src'
import Target from './fixtures/Target'

const targetString = '#target'

describe('ScrollNextLevel', () => {
  let spy

  beforeAll(() => {
    global.scroll = () => {}
  })

  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {}
  })

  afterEach(() => {
    if (spy) {
      try {
        spy.mockClear()
      } catch (e) {}
      spy = undefined
    }
  })

  describe('default scroll', () => {
    describe('clicked', () => {
      it('does scroll to top without target', () => {
        spy = jest.spyOn(global, 'scroll')
        const wrapper = mount(ScrollNextLevel, {
          attachToDocument: true
        })

        expect(spy).toHaveBeenCalledTimes(0)

        wrapper.trigger('click')

        expect(spy).toBeCalledWith({
          top: 0,
          behavior: 'smooth'
        })
      })

      it('does navigate to path without hash when enabled and scroll to top', () => {
        spy = jest.spyOn(global, 'scroll')
        const localVue = createLocalVue()
        localVue.use(VueRouter)
        const router = new VueRouter()

        const wrapper = mount(ScrollNextLevel, {
          attachToDocument: true,
          context: {
            props: {
              shouldNavigate: true
            }
          },
          localVue,
          router
        })

        router.replace('#test')

        expect(spy).toHaveBeenCalledTimes(0)

        wrapper.trigger('click')

        expect(spy).toBeCalledWith({
          top: 0,
          behavior: 'smooth'
        })
        expect(router.currentRoute.fullPath).toBe('/')
      })

      it('does smooth scroll to target when present', () => {
        spy = jest.spyOn(Element.prototype, 'scrollIntoView')

        const wrapper = mount(ScrollNextLevel, {
          attachToDocument: true,
          context: {
            props: {
              target: targetString
            }
          },
          slots: {
            default: Target
          }
        })

        expect(wrapper.html()).toBe('<div><div id="target">Hi</div></div>')

        expect(wrapper.contains(targetString)).toBe(true)

        const element = wrapper.find(targetString).element

        expect(element.scrollIntoView).toHaveBeenCalledTimes(0)

        wrapper.trigger('click')

        expect(element.scrollIntoView).toBeCalledWith({
          behavior: 'smooth'
        })
      })

      it('does navigate to target after smooth-scrolling', () => {
        spy = jest.spyOn(Element.prototype, 'scrollIntoView')
        const localVue = createLocalVue()
        localVue.use(VueRouter)
        const router = new VueRouter()

        const wrapper = mount(ScrollNextLevel, {
          attachToDocument: true,
          context: {
            props: {
              target: targetString,
              shouldNavigate: true
            }
          },
          slots: {
            default: Target
          },
          localVue,
          router
        })

        expect(wrapper.html()).toBe('<div><div id="target">Hi</div></div>')

        expect(wrapper.contains(targetString)).toBe(true)

        const element = wrapper.find(targetString).element

        expect(element.scrollIntoView).toHaveBeenCalledTimes(0)

        wrapper.trigger('click')

        expect(element.scrollIntoView).toBeCalledWith({
          behavior: 'smooth'
        })

        expect(router.currentRoute.fullPath).toBe(`/${targetString}`)
      })

      it('does send error if target is set but not present', () => {
        const weirdTarget = 'weird things here'
        spy = jest.spyOn(console, 'error')

        const wrapper = mount(ScrollNextLevel, {
          attachToDocument: true,
          context: {
            props: {
              target: weirdTarget
            }
          }
        })

        expect(spy).toHaveBeenCalledTimes(0)

        wrapper.trigger('click')

        expect(spy).toBeCalledWith(`Could not scroll to ${weirdTarget}`)
      })

      it('does smooth scroll to target (as function) when present', async () => {
        spy = jest.spyOn(Element.prototype, 'scrollIntoView')

        const wrapper = mount(ScrollNextLevel, {
          attachToDocument: true,
          context: {
            props: {
              target: async () => {
                await Promise.resolve(r => setTimeout(r, Math.random() * 500))
                return targetString
              }
            }
          },
          slots: {
            default: Target
          }
        })

        expect(wrapper.html()).toBe('<div><div id="target">Hi</div></div>')

        expect(wrapper.contains(targetString)).toBe(true)

        const element = wrapper.find(targetString).element

        expect(element.scrollIntoView).toHaveBeenCalledTimes(0)

        wrapper.trigger('click')

        await flushPromises()

        expect(element.scrollIntoView).toHaveBeenCalledTimes(1)

        expect(element.scrollIntoView).toBeCalledWith({
          behavior: 'smooth'
        })
      })
    })
  })

  describe('custom scroll function', () => {
    it('does not call custom function if not clicked', () => {
      const spy = jest.fn()
      mount(ScrollNextLevel, {
        context: {
          props: {
            scrollFunction: spy
          }
        },
        attachToDocument: true
      })

      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('calls custom function on click', () => {
      const spy = jest.fn(() => {})
      const wrapper = mount(ScrollNextLevel, {
        context: {
          props: {
            scrollFunction: spy
          }
        },
        attachToDocument: true
      })
      wrapper.trigger('click')

      expect(spy).toBeCalledWith(undefined, { $parent: undefined, navigationType: 'push', shouldNavigate: false })
    })

    it('calls custom function with target on click', () => {
      const spy = jest.fn(() => {})
      const wrapper = mount(ScrollNextLevel, {
        context: {
          props: {
            scrollFunction: spy,
            target: targetString
          }
        },
        attachToDocument: true
      })
      wrapper.trigger('click')

      expect(spy).toBeCalledWith(targetString, {
        $parent: undefined,
        navigationType: 'push',
        shouldNavigate: false
      })
    })
  })

  describe('SSR', () => {
    it('does nothing on server-side', (done) => {
      try {
        render(ScrollNextLevel, {
          context: {
            props: {
              targetString
            }
          },
          slots: {
            default: Target
          }
        })
        done()
      } catch (e) { }
    })
  })
})
