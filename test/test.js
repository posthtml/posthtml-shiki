import path from 'node:path'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {test, expect} from 'vitest'
import posthtml from 'posthtml'
import plugin from '../lib/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8').trim()
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8').trim()

// eslint-disable-next-line
const error = (name, options, cb) => posthtml([plugin(options)]).process(fixture(name)).catch(cb)
const clean = html => html.replaceAll(/[^\S\r\n]+$/gm, '').trim()

const process = (name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => expect(html).toEqual(expected(name)))
}

test('basic', () => {
  return process('basic')
})

test('language attribute', () => {
  return process('lang')
})

test('theme attribute', () => {
  return process('theme')
})

test('dual themes', () => {
  return process('dual-themes')
})

test('default color (option)', () => {
  return process('default-color', {
    defaultColor: 'dark'
  })
})

test('custom tag', () => {
  return process('tag', {tag: 'highlight'})
})

test('wrapping tag (attribute)', () => {
  return process('wrap-attribute')
})

test('wrapping tag (options)', () => {
  return process('wrap-options', {wrapTag: 'div'})
})

test('decorations', () => {
  return process('decorations', {
    decorations: [
      {
        // line and character are 0-indexed
        start: { line: 1, character: 2 },
        end: { line: 1, character: 8 },
        properties: { class: 'highlighted-word' }
      }
    ]
  })
})

test('transformers', () => {
  return process('transformers', {
    transformers: [
      {
        code(node) {
          this.addClassToHast(node, 'language-js')
        },
      }
    ]
  })
})

test('custom theme', () => {
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

  return process('custom-theme', {
    themes: [myTheme]
  })
})

test('custom language', () => {
  const myLang = JSON.parse(readFileSync('./test/stubs/custom-diff.json', 'utf8'))

  return process('custom-lang', {
    langs: [myLang]
  })
})
