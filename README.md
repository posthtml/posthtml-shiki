<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Shiki Plugin</h1>
  <p>Highlight code with PostHTML and Shiki</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

- [Installation](#installation)
- [Usage](#usage)
- [Attributes](#attributes)
- [Options](#options)

This is a PostHTML plugin that uses [Shiki](https://shiki.style) to highlight code blocks.

Features:

- [x] Configure [`langs`](#langs)
- [x] Configure [`themes`](#themes)
- [x] [`lang`](#lang) attribute
- [x] [`theme`](#theme) attribute
- [x] [Dual Themes](#theme-1)
- [x] [Wrap in custom tag](#wrap)
- [x] [Default color theme](#default-color)
- [x] [Decorations](#decorations)
- [x] [Transformers](#transformers)
- [x] Custom themes
- [ ] Custom languages

Input:

```xml
<shiki>
  <h1 class="text-xl">Hello</h1>
</shiki>
```

Output:

```html
<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"></span>
<span class="line"><span style="color:#81A1C1">  &#x3C;h1</span><span style="color:#8FBCBB"> class</span><span style="color:#ECEFF4">=</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">text-xl</span><span style="color:#ECEFF4">"</span><span style="color:#81A1C1">></span><span style="color:#D8DEE9FF">Hello</span><span style="color:#81A1C1">&#x3C;/h1></span></span>
<span class="line"></span></code></pre>
```

## Installation

```
npm i posthtml posthtml-shiki
```

## Usage

Use the `<shiki>` tag to highlight all code inside it:

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki()
])
  .process('<shiki><h1 class="text-xl">Hello</h1></shiki>')
  .then(result => result.html)
```

## Attributes

You may use certain attributes to configure which themes or language to use.

### `lang`

Alias: `language`

Use the `lang` attribute to specify the language of the code block.

```xml
<shiki lang="javascript">
  import { codeToHtml } from 'shiki'
</shiki>
```

### `theme`

Use the `theme` attribute to specify the theme to use.

```xml
<shiki theme="github-light">
  <h1 class="text-xl">Hello</h1>
</shiki>
```

### `theme-*`

Shiki's [Dual Themes](https://shiki.style/guide/dual-themes) is supported through `theme-*` attributes:

```xml
<shiki theme-light="github-light" theme-dark="github-dark">
  <h1 class="text-xl">Hello</h1>
</shiki>
```

> [!NOTE]
> If a `theme` attribute is present, it will override the `theme-*` attributes.

This uses CSS variables to switch between themes, so you'll need to define the CSS variables in your stylesheet.

With media queries:

```css
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
```

Class-based:

```css
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

### `default-color`

When using multiple themes, you may specify the default color theme for Shiki to use.

The value of the attribute must be the name of one of the `theme-*` attributes, so for example if you have `theme-light` and `theme-dark` attributes, the attribute value must be either `light` or `dark`.

```xml
<shiki 
  theme-light="github-light" 
  theme-dark="github-dark" 
  default-color="dark"
>
  <h1 class="text-xl">Hello</h1>
</shiki>
```

Shiki relies on CSS specificity and changes the order of the classes on the wrapping `<pre>` tag.

By default, the plugin does not set `default-color`.

### `wrap`

By default, the `<shiki>` tag will be removed and the code block will be wrapped in a `<pre>` tag. Use the `wrap` attribute to define a custom tag to wrap the code block in.

```xml
<shiki lang="js" wrap="div">
  import { codeToHtml } from 'shiki'
</shiki>
```

Result:

```html
<div><pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span><span style="color:#8FBCBB"> codeToHtml</span><span style="color:#ECEFF4"> }</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> '</span><span style="color:#A3BE8C">shiki</span><span style="color:#ECEFF4">'</span></span></code></pre></div>
```

> [!IMPORTANT]  
> The value of the `wrap` attribute must be a valid tag name, CSS selectors are not supported.

## Options

The plugin accepts an options object as the first argument, which can be used to configure things like the tag name or the options to pass to Shiki.

### `tag`

Type: `string`\
Default: `shiki`

Use the `tag` option to specify the tag name to use.

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    tag: 'highlight'
  })
])
  .process('<highlight>... your code</highlight>')
  .then(result => result.html)
```

### `langs`

Type: `string[]`\
Default: `['html']`

Use the `langs` option to specify the languages for Shiki to load. 

It's recommended to load only the languages that you need.

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    langs: ['html', 'javascript']
  })
])
  .process(`
    <shiki lang="html">... some html</shiki>
    <shiki lang="javascript">... some js</shiki>
  `)
    .then(result => result.html)
```

See the list of [supported languages](https://shiki.style/languages) in Shiki.

### `themes`

Type: `string[]`\
Default: `['nord']`

Use the `themes` option to specify the themes for Shiki to load.

It's recommended to load only the themes that you need.

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    themes: ['github-light', 'github-dark']
  })
])
  .process(`
    <shiki theme="github-light">[code]</shiki>
    <shiki theme="github-dark">[code]</shiki>
  `)
    .then(result => result.html)
```

See the list of [available themes](https://shiki.style/themes) in Shiki.

> [!NOTE]
> If you don't specify a `theme=""` attribute, the first theme in the `themes` option will be used.

You may also load [custom themes](https://shiki.style/guide/load-theme):

```js
// Define textmate theme
const myTheme = {
  name: 'my-theme',
  settings: [
    {
      scope: ['string'],
      settings: {
        foreground: '#888'
      }
    },
  ]
}

posthtml([
  shiki({
    themes: [myTheme],
  })
])
  .process(`<shiki theme="my-theme">[code]</shiki>`)
  .then(result => result.html)
```

If you're loading multiple themes, you will need to specify which theme to use with the `theme=""` attribute. For custom themes, the attribute value must match the name of the theme - in the example above, that would be `my-theme`.

### `wrapTag`

Type: `string|boolean`\
Default: `false`

Use the `wrapTag` option to specify a custom tag to wrap the highlighted code block in.

By default, the plugin does not wrap the code block in any tag.

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    wrapTag: 'div'
  })
])
  .process('<shiki>... your code</shiki>')
  .then(result => result.html)
```

Result:

```html
<div>
  [highlighted code]
</div>
```

### `defaultColor`

Type: `string`\
Default: `undefined`

Use the `defaultColor` option to specify the default color theme for Shiki to use.

The value must be the key name of one of the themes in the `themes` option.

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'dark'
  })
])
  .process(`
    <shiki>
      [code]
    </shiki>
  `)
  .then(result => result.html)
```

### `decorations`

Type: `array`\
Default: `[]`

Shiki's [Decorations](https://shiki.style/guide/decorations) are supported through the `decorations` option.

You can use this to wrap custom classes and attributes around character ranges in your code.

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    decorations: [
      {
        // line and character are 0-indexed
        start: { line: 1, character: 2 },
        end: { line: 1, character: 7 },
        properties: { class: 'highlighted-word' }
      }
    ]
  })
])
  .process(`
    <shiki>
      const foo = 'bar'
    </shiki>
  `)
  .then(result => result.html)
```

The word `const` will be wrapped in a `<span class="highlighted-word">` tag.

### `transformers`

Type: `array`\
Default: `[]`

Use this option to transform the highlighted code block with Shiki's [Transformers](https://shiki.style/guide/transformers).

```js
import posthtml from 'posthtml'
import shiki from 'posthtml-shiki'

posthtml([
  shiki({
    transformers: [
      {
        code(node) {
          this.addClassToHast(node, 'language-js')
        },
      }
    ]
  })
])
  .process(`
    <shiki>
      const foo = 'bar'
    </shiki>
  `)
  .then(result => result.html)
```

The generated `<code>` tag will have the `language-js` class added.

[npm]: https://www.npmjs.com/package/posthtml-shiki
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-shiki.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-shiki
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-shiki.svg
[github-ci]: https://github.com/posthtml/posthtml-shiki/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-shiki/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-shiki.svg
