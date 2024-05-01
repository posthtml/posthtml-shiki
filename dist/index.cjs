'use strict';

const shiki = require('shiki');
const posthtmlRender = require('posthtml-render');
const parseAttrs = require('posthtml-attrs-parser');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const parseAttrs__default = /*#__PURE__*/_interopDefaultCompat(parseAttrs);

const plugin = (options = {}) => (tree) => {
  options.langs = options.langs || ["html"];
  options.themes = options.themes || ["nord"];
  options.wrapTag = options.wrapTag || false;
  options.tag = options.tag || "shiki";
  options.decorations = options.decorations || [];
  options.transformers = options.transformers || [];
  const promises = [];
  tree.walk((node) => {
    let promise;
    if (node.tag === options.tag && node.content) {
      const attrs = parseAttrs__default(node.attrs);
      let highlighterOptions = {};
      if (attrs.theme) {
        if (options.themes.some((theme) => theme.name !== attrs.theme)) {
          options.themes = [attrs.theme, ...options.themes];
        }
        highlighterOptions.theme = attrs.theme;
      } else {
        const themes = Object.entries(attrs).filter(([key]) => key.startsWith("theme-"));
        if (themes.length > 0) {
          options.themes = [];
          highlighterOptions.themes = {};
          themes.forEach(([key, value]) => {
            options.themes.push(value);
            highlighterOptions.themes[key.replace("theme-", "")] = value;
          });
        } else {
          highlighterOptions.theme = options.themes[0];
        }
      }
      promise = shiki.getHighlighter({
        langs: options.langs,
        themes: options.themes
      }).then((highlighter) => {
        highlighterOptions.lang = attrs.lang || attrs.language || options.langs[0];
        const wrapTag = attrs.wrap || options.wrapTag;
        const source = posthtmlRender.render(node.content).trim();
        if (attrs["default-color"]) {
          highlighterOptions.defaultColor = attrs["default-color"];
        }
        if (options.defaultColor) {
          highlighterOptions.defaultColor = options.defaultColor;
        }
        if (options.decorations) {
          highlighterOptions.decorations = options.decorations;
        }
        if (options.transformers) {
          highlighterOptions.transformers = options.transformers;
        }
        node.attrs = {};
        node.tag = wrapTag;
        node.content = highlighter.codeToHtml(source, highlighterOptions);
      });
      promises.push(promise);
    }
    return node;
  });
  return Promise.all(promises).then(() => tree);
};

module.exports = plugin;
