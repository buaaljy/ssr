const qs = require('qs');
const request = require('request');

const METHOD_GET = 'get';
// const METHOD_POST = 'post';
// const METHOD_JSONP = 'jsonp';
const DEFAULT_METHOD = METHOD_GET;

module.exports = async function (api, params) {
  const method = (api.method || DEFAULT_METHOD).toLowerCase();
  const requestParams = Object.assign({}, api.params || {}, params || {});
  const domain = api.domain || 'http://127.0.0.1:7001';
  const url = `${domain}${api.url}?${qs.stringify(requestParams)}`; 
  return new Promise((resolve, reject) => {
    request({
      url,
      method,
    }, (err, response, body) => {
      if (err) {
        resolve(null);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};
