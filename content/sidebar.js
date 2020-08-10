const hyperx = require('hyperx');

module.exports = function (h) {
  const html = hyperx(h);

  return html`
    <sidebar>
      <ul>
        <li>
          <span>Developers</span>
          <ul>
            <li><a href="/">Introduction</a></li>
            <li><a href="/guides/getting-started">Getting Started</a></li>
          </ul>
        </li>
        <li>
          <span>Global Logic</span>
          <ul>
            <li><a href="/api/global-logic/authentication">Authentication</a></li>
            <li><a href="/api/global-logic/pagination">Pagination</a></li>
            <li><a href="/api/global-logic/filtering">Filtering</a></li>
            <li><a href="/api/global-logic/scripting">Scripting</a></li>
            <li><a href="/api/global-logic/sorting">Sorting</a></li>
          </ul>
        </li>
        <li>
          <span>Entities</span>
          <ul>
            <li><a href="/api/entities/databases">Databases</a></li>
            <li><a href="/api/entities/collections">Collections</a></li>
            <li><a href="/api/entities/records">Records</a></li>
          </ul>
        </li>
      </ul>
    </sidebar>
  `;
};
