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

const process = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => expect(html).toEqual(expected(name)))
}

test('basic', t => {
  return process(t, 'basic')
})

test('language attribute', t => {
  return process(t, 'lang')
})

test('theme attribute', t => {
  return process(t, 'theme')
})

test('dual themes', t => {
  return process(t, 'dual-themes')
})

test('default color (option)', t => {
  return process(t, 'default-color', {
    defaultColor: 'dark'
  })
})

test('custom tag', t => {
  return process(t, 'tag', {tag: 'highlight'})
})

test('wrapping tag (attribute)', t => {
  return process(t, 'wrap-attribute')
})

test('wrapping tag (options)', t => {
  return process(t, 'wrap-options', {wrapTag: 'div'})
})
