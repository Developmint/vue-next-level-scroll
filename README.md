# VueNextLevelScroll - Bring your scroll game to the next level!

<p align="center">
  <a href="https://travis-ci.com/Developmint/vue-next-level-scroll"><img src="https://travis-ci.com/Developmint/vue-next-level-scroll.svg?branch=master" alt="Build Status"></a>
  <a href="https://codecov.io/gh/Developmint/vue-next-level-scroll"><img src="https://codecov.io/gh/Developmint/vue-next-level-scroll/branch/master/graph/badge.svg" alt="Code coverage"></a>
  <a href="https://www.npmjs.com/package/vue-next-level-scroll"><img src="https://img.shields.io/npm/dm/vue-next-level-scroll.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-next-level-scroll"><img src="https://img.shields.io/npm/v/vue-next-level-scroll.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-next-level-scroll"><img src="https://img.shields.io/npm/l/vue-next-level-scroll.svg" alt="License"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="We use Conventional Commits"></a>
</p>

> "Click to scroll" **component** using the modern Browser API.

## :fire:  Features

- Just **one tiny file**
- Component based (great for **async loading** and code splitting)
- Supports navigation through *VueRouter*
- Universal code/SSR-safe
- Well tested and **documented**
- Compatible with Node 8.0+
- Vue as the only dependency
- Highly customizable

## :mag_right: Getting started

### :star: Demo

A live demo is available at [https://oqxy5xr5ny.sse.codesandbox.io/](https://oqxy5xr5ny.sse.codesandbox.io/).

### :package: Through NPM

```
$ npm install vue-next-level-scroll
```

#### Synchronous import

```js
import VueNextLevelScroll from 'vue-next-level-scroll'


export default {
  components: {
    VueNextLevelScroll
  }
}

```

#### Async import

```js
export default {
  components: {
    VueNextLevelScroll: () => import('vue-next-level-scroll')
  }
}

```

### :link: Using a CDN

[UNPKG](https://unpkg.com/vue-next-level-scroll/dist/) | [jsDelivr](https://cdn.jsdelivr.net/npm/vue-next-level-scroll/dist/) (available as window.nextLevelScroll)

```js
Vue.component('scroll', window.nextLevelScroll)

// Continue as you wish. If you want to load a scroll behavior polyfill, do it **before** adding the CDN link.

```


## :hammer_and_wrench: Usage

### You might like to go for a Polyfill

VueNextLevelScroll uses the new [`ScrollBehavior specification`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) by default.
Unfortunately, Firefox is the only browser that has it built-in (by now).
For this reason, you might like to go for [this polyfill](https://github.com/iamdustan/smoothscroll) (don't worry, less than 2kB after GZIP).


### The component based approach

As you likely have seen, there are various *Vue directives* out their that handle scrolling as well.
You might have used one or two of them already or built one yourself.

**But!** A component can sometimes be the better approach, as it can be tree shaken, is
better suited for universal/SSR code and can be loaded asynchronously as well!

### Prop overview


| Prop | Optional? | Comment |
|---| --- | --- |
| target | :white_check_mark: | Can be any query selector you want (or a function that returns such). Will be passed to the scroll function |
| scrollFunction  | :white_check_mark: | You can define an own scroll function that will take the `target` prop as parameter and can do whatever you like. |
| shouldNavigate  | :white_check_mark: | If set, VueRouter will reflect navigation changes in the url(top: no hash, target: hash)  |
| navigationType  | :white_check_mark: | Default to `push`. The navigation type of that VueRouter should use. Usually either `push` or `replace` |


### Default scroll function explained

#### Scroll to top

When no `target` prop is set, the default scroll function will trigger a scroll to top:

```html
<vue-next-level-scroll>
  <img src="https://developmint.de/logo.png">
</vue-next-level-scroll>
```

#### Scroll to query selector

When the `target` prop is provided, the default scroll function look the DOM node up and smooth scroll to it.
If the `target` is a class query, the first found element will be chosen to scroll to.

```html
<vue-next-level-scroll target="#my-target">
  <img src="https://developmint.de/logo.png">
</vue-next-level-scroll>
<div id="my-target"/>
```

#### Scroll to non-existing query selector

When the `target` prop is given but no node matches, a console error will appear.

```html
<vue-next-level-scroll target="#my-target">
  <img src="https://developmint.de/logo.png">
</vue-next-level-scroll>
<div id="my-non-existing-target"/>
```

```js
Error: Could not scroll to #my-target
```

### Custom scroll function

Most users are satisfied with the default scroll function provided by *VueNextLevelScroll*
However if you need other behavior you can simply write your own function:

```html
<template>
    <vue-next-level-scroll
      target="#my-target"
      :scroll="myScroll">
      <img src="https://developmint.de/logo.png">
    </vue-next-level-scroll>
    <div id="my-non-existing-target"/>
</template>

<script>
export default {
 methods: {
   myScroll (target) { doSomeMagicHere(target) }
  }
}
</script>
```

You might not need the polyfill then as well :wink:

## :gear: Contributing

Please see our [CONTRIBUTING.md](./CONTRIBUTING.md)


## :bookmark_tabs: License

[MIT License](./LICENSE.md) - Copyright (c) Developmint - Alexander Lichter
