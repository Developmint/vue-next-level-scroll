export default {
  functional: true,
  render(h, { children, data, props: { target, scrollFunction }, _ssrNode }) {
    const clickFunction = () => { scrollFunction ? scrollFunction(target) : defaultScrollFunction(target) }

    return h('div', {
      ...data,
      on: {
        // Ignore scroll function on server side
        click: _ssrNode || process.server ? undefined : clickFunction
      }
    }, children)
  }
}

const defaultScrollFunction = async (rawTarget) => {
  const target = (typeof rawTarget === 'function') ? await rawTarget() : rawTarget

  // If no target given, auto scroll to top
  if (!target) {
    return window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }

  const node = document.querySelector(target)

  // If target prop is present but the node does not exist, send an error
  if (!node) {
    // eslint-disable-next-line no-console
    return console.error(`Could not scroll to ${target}`)
  }

  node.scrollIntoView({
    behavior: 'smooth'
  })
}
