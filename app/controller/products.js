'use strict';

const fs = require('fs');
const path = require('path');
const request = require('../../lib/request');
const { NodeVM } = require('vm2');
const { JSDOM } = require("jsdom");

const generatorUUID = () => {
  return Date.now();
};

module.exports = app => {
  class ProductsController extends app.Controller {
    * hello() {
      // const isClientRender = true;
      const isClientRender = this.ctx.query.isClientRender === '1';
      const html = fs.readFileSync(path.join(__dirname, '../../products/multipage/pages/hello/index.html'), 'utf-8');
      const uuid = generatorUUID();
      if (isClientRender) {
        this.ctx.body = html;
      } else {
        app.messenger.sendToAgent('before_render', {
          uuid,
          originalUrl: this.ctx.originalUrl,
          app,
        });
        const serverBundleContent = fs.readFileSync(path.join(__dirname, '../../products/multipage/pages/hello/server.bundle.js'));
        const { window } = new JSDOM('', {
          url: `http://${this.ctx.request.header.host}${this.ctx.request.url}`,
        });
        const { location, document } = window;
        const vm = new NodeVM({
          console: 'inherit',
          sandbox: {
            window,
            location,
            document,
          },
        });
        const serverBundle = vm.run(serverBundleContent);
        const prefetchList = serverBundle.prefetch();
        const prefetchGenerators = prefetchList.map((item) => request(item));
        const prefetchData = yield prefetchGenerators;
        const reactString = serverBundle.render(prefetchData);
        this.ctx.body = html.replace('<div id="root"></div>', `${insertServerSideData(prefetchData)}<div id="root">${reactString}</div>`);
        app.messenger.sendToAgent('after_render', {
          uuid,
          originalUrl: this.ctx.originalUrl,
          app,
        });
      }
      this.ctx.set('Content-Type', 'text/html');
    }
    * hellojs() {
      const js = fs.readFileSync(path.join(__dirname, '../../products/multipage/pages/hello/client.bundle.js'), 'utf-8');
      this.ctx.body = js;
      this.ctx.set('Content-Type', 'text/javascript');
    }
  }
  return ProductsController;
};

function insertServerSideData(serverSideData) {
  return (
    `<script>
      window._server_side_data_ = ${JSON.stringify(serverSideData)};
    </script>`
  );
}
