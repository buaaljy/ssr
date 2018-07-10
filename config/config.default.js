'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1501750189781_5913';

  config.middleware = [ 'ssr' ];
  config.ssr = {
    match: '/products',
  };

  return config;
};
