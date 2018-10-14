export default {
  functional: true,
  render(h, { children, data, props: { target, scrollFunction, shouldNavigate = false, navigationType = 'push', tag = 'div' }, parent: { $router }, _ssrNode }) {
    const clickFunction = () => {
      const fn = scrollFunction || defaultScrollFunction
      fn(target, { shouldNavigate, navigationType, $router })
    }

    return h(tag, {
      ...data,
      on: {
        // Ignore scroll function on server side
        click: _ssrNode || process.server ? undefined : clickFunction
      }
    }, children)
  }
}

const defaultScrollFunction = async (rawTarget, { shouldNavigate, navigationType, $router }) => {
  const target = (typeof rawTarget === 'function') ? await rawTarget() : rawTarget
  // If no target given, auto scroll to top
  if (!target) {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
    if (shouldNavigate && $router) {
      const currentRoute = $router.currentRoute
      const hash = currentRoute.hash
      const fullPath = currentRoute.fullPath
      const newPath = fullPath.replace(hash, '')
      navigate($router, newPath, navigationType)
    }
    return
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

  if (shouldNavigate && $router) {
    navigate($router, target, navigationType)
  }
}

const navigate = ($router, path, type) => { $router[type](path) }
