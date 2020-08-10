const path = require('path');
const fs = require('fs').promises;

const { format } = require('date-fns');
const marked = require('marked');

function getPosition (string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

module.exports = async function generateBlog (h, createPage) {
  const entriesEventual = (await fs.readdir('./content/blog'))
    .map(async file => {
      const date = new Date(file.slice(0, 10));
      const title = file.slice(11, 12).toUpperCase() + file.slice(12, -3).replace(/-/g, ' ');
      const stated = await fs.stat(path.join('./content/blog', file));

      return {
        date,
        fullfile: file,
        lastModified: stated.mtime,
        name: `${date.getFullYear()}/${String(date.getMonth()).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${file.slice(11, -3)}`,
        category: format(date, 'MMMM yyyy'),
        content: await fs.readFile(path.join('./content/blog', file), 'utf8'),
        title
      };
    })
    .sort((a, b) => a < b ? 1 : -1);

  const entries = await Promise.all(entriesEventual);

  const categories = entries.reduce((previous, current) => {
    if (!previous.find(name => name === current.category)) {
      previous.push(current.category);
    }

    return previous;
  }, []);

  const sidebarList = h('ul',
    ...categories.map(category => {
      const categoryEntries = entries.filter(file => file.category === category);

      return h('li',
        h('span', category),
        h('ul',
          ...categoryEntries.map(entry =>
            h('li',
              h('span', entry.date.getDate()),
              h('a', { href: '/blog/' + entry.name }, entry.title)
            )
          )
        )
      );
    })
  );

  const latestEntries = [];

  entries.forEach(entry => {
    const contentBody = entry.content.slice(getPosition(entry.content, '---', 2) + 4);
    const metadata = entry.content.slice(4, getPosition(entry.content, '---', 2))
      .trim()
      .split('\n')
      .reduce((previous, current) => {
        const split = current.split(':');
        previous[split[0]] = current.slice(current.indexOf(':') + 1).trim();
        return previous;
      }, {});

    metadata.lastModified = metadata.lastModified && new Date(metadata.lastModified);

    const content = marked(contentBody);

    const entryTree = h('',
      h('h1',
        metadata.title,
        h('small', 'Published by ',
          h('a', { href: metadata.authorURL, target: '_blank' }, metadata.author),
          ' on ',
          format(entry.date, 'yyyy-MM-dd')
        )
      ),
      h('div', { class: 'content-info' },
        h('a', { target: '_blank', class: 'edit-page', href: `https://github.com/bitabase/bitabase-documentation/blob/master/${path.join('./content/blog', entry.fullfile)}` },
          'Edit this page'
        ),
        format(entry.date, 'yyyy-MM-dd') !== format(metadata.lastModified || entry.lastModified, 'yyyy-MM-dd')
          && h('em', 'Last updated: ', format(metadata.lastModified || entry.lastModified, 'yyyy-MM-dd'))
      ),
      h('div', { dangerouslySetInnerHTML: { __html: content } }, 'placeholder'),
      h('hr')
    );

    if (latestEntries.length < 5) {
      latestEntries.push(entryTree);
    }

    createPage('/blog/' + entry.name, entry.name,
      h('div', { class: 'with-sidebar' },
        h('div', { class: 'thin content' },
          h('sidebar',
            sidebarList
          ),
          h('section', entryTree)
        )
      )
    );
  });

  createPage('/blog', 'Blog',
    h('div', { class: 'with-sidebar' },
      h('div', { class: 'thin content' },
        h('sidebar',
          sidebarList
        ),
        h('section',
          ...latestEntries
        )
      )
    )
  );
};
