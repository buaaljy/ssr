import qs from 'qs';
import jsonp from 'universal-jsonp';

const METHOD_GET = 'get';
const METHOD_POST = 'post';
const METHOD_JSONP = 'jsonp';
const DEFAULT_DATA_TYPE = 'json';
const DEFAULT_METHOD = METHOD_GET;
const DEFAULT_JSONP_CALLBACK_FUNCTION_NAME = 'callback';

export default function request(api, params) {
  const method = (api.method || DEFAULT_METHOD).toLowerCase();
  if (method === METHOD_GET) {
    const requestParams = Object.assign({}, api.params || {}, params || {});
    const domain = api.domain || '';
    const url = `${domain}${api.url}?${qs.stringify(requestParams)}`;
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      fetch(url, {
        dataType: DEFAULT_DATA_TYPE,
      })
        .then(response => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } else if (method === METHOD_JSONP) {
    const requestParams = Object.assign({}, api.params || {}, params || {});
    const domain = api.domain || '';
    const url = `${domain}${api.url}?${qs.stringify(requestParams)}`;
    return new Promise((resolve, reject) => {
      jsonp(url, {
        jsonpCallbackFunctionName: api.callback || DEFAULT_JSONP_CALLBACK_FUNCTION_NAME,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } else if (method === METHOD_POST) {
    const requestParams = Object.assign({}, api.params || {}, params || {});
    const domain = api.domain || '';
    const url = `${domain}${api.url}?_t=${new Date().getTime()}`;
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      fetch(url, {
        dataType: DEFAULT_DATA_TYPE,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: qs.stringify(requestParams),
      })
        .then((response) => {
          return new Promise((resolve1, reject1) => {
            response.text().then((str) => {
              const formatStr = str.replace(/^\(|\)$/g, '');
              try {
                const data = JSON.parse(formatStr);
                const code = data && (+data.code);
                if (code === 401) {
                  alert(data ? data.msg : '网络繁忙！');  // eslint-disable-line
                } else {
                  resolve1(data);
                }
              } catch (err) {
                reject1(err);
              }
            });
          });
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
