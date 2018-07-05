import React from 'react';
const ReactDOMServer = require("react-dom/server");
import App from './app';

import { testModule } from '../../service';

export const prefetch = function() {
  return [ testModule.getUser ];
};

export const render = function(serverSideData) {
  return ReactDOMServer.renderToString(<App serverSideData={serverSideData} />);
}
