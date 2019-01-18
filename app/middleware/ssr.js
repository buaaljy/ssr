const { NodeVM } = require('vm2');
const { JSDOM } = require("jsdom");
const uuidv1 = require('uuid/v1');
const fileCache = require('../../lib/cache/fileCache');
const request = require('../../lib/request');

module.exports = (options, app) => {
  return async function(ctx, next) {
    await next();
    const t0 = +(new Date);
    const url = ctx.request.url.replace(/\?[\w\W]*$/g, '');
    const content = await fileCache.get(ctx, url);
    setHeaders(ctx, url);
    // resolve 404
    if (content === false) {
      ctx.body = '404 not found';
      return;
    }
    // resolve js|css
    if (!url.match(/\.html$/)) {
      ctx.body = content;
      return;
    }
    const isClientRender = ctx.query.isClientRender === '1';
    if (isClientRender) {
      ctx.body = content;
      return; 
    }
    // server-side-render
    // const sendToAgentMessage = {
    //   uuid: uuidv1(),
    //   originalUrl: ctx.originalUrl,
    //   app,
    // };
    // app.messenger.sendToAgent('before_render', sendToAgentMessage);
    
    const t1 = +(new Date);
    const vm2 = getVM(ctx);
    const serverBundleContent = await fileCache.get(ctx, url.replace(/index\.html$/, 'server.bundle.js'));
    const serverBundle = vm2.run(serverBundleContent);
    const t2 = +(new Date);
    // paralla fetch data
    const prefetchList = serverBundle.prefetch();
    const prefetchGenerators = prefetchList.map((item) => request(item));
    const prefetchData = await Promise.all(prefetchGenerators);
    const t3 = +(new Date);
    const renderString = await (new Promise(resolve => {
      serverBundle.render(prefetchData).then((str) => {
        resolve(str);
      })
    }));
    const replaceContent = content.replace('<div id="root"></div>', `${insertServerSideData(prefetchData)}<div id="root">${renderString}</div>`);
    ctx.body = replaceContent;
    const t4 = +(new Date);
    console.log(t4 - t0, t2 - t1, t3 - t2, t4 - t3);
    // app.messenger.sendToAgent('after_render', sendToAgentMessage);
  };
};

function insertServerSideData(serverSideData) {
  return (
    `<script>
      window._server_side_data_ = ${JSON.stringify(serverSideData)};
    </script>\n`
  );
}

function getVM(ctx) {
  const { window } = new JSDOM('', {
    url: `http://${ctx.request.header.host}${ctx.request.url}`,
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
  return vm;
}

function setHeaders(ctx, url) {
  if (url.match(/\.html$/)) {
    ctx.set('Content-Type', 'text/html');
  } else if (url.match(/\.js$/)) {
    ctx.set('Content-Type', 'text/javascript');
  } else if (url.match(/\.css$/)) {
    ctx.set('Content-Type', 'text/css');
  }
}