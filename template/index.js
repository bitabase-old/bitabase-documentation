const extra = require('../content/extra');

const blog = require('./blog');
const pages = require('./pages');

function app (h, createPage) {
  extra(h, createPage);
  blog(h, createPage);
  pages(h, createPage, 'api');
  pages(h, createPage, 'guides');
}

module.exports = app;
