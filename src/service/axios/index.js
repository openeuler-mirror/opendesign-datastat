import axios from 'axios';
import handleError from './handleError';
import handleResponse from './handleResponse';
import setConfig from './setConfig';

/**
 * intactRequest是只在axios基础上更改了请求配置。
 * 而request是基于axios创建的实例，实例只有常见的数据请求方法，没有axios.isCancel/ axios.CancelToken等方法，
 * 也就是没有**取消请求**和**批量请求**的方法。
 * 所以如果需要在实例中调用取消某个请求的方法（例如取消上传），请用intactRequest。
 */
const intactRequest = setConfig(axios);
const request = setConfig(intactRequest.create());

// 请求中的api
const pendingPool = new Map();

/**
 * 请求拦截
 */
const requestInterceptorId = request.interceptors.request.use(
  (config) => {
    // 对于异常的响应也需要在pendingPool中将其删除，但响应拦截器中的异常响应有些获取不到请求信息，这里将其保存在实例上
    request.config = Object.assign({}, config);

    config.cancelToken = new axios.CancelToken((cancelFn) => {
      pendingPool.has(config.url)
        ? cancelFn(`${config.url}请求重复`)
        : pendingPool.set(config.url, { cancelFn, global: config.global });
    });

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

/**
 * 响应拦截
 */
const responseInterceptorId = request.interceptors.response.use(
  (response) => {
    const { config } = response;
    pendingPool.delete(config.url);

    return Promise.resolve(handleResponse(response));
  },
  (err) => {
    const { config } = request;
    if (axios.isCancel(err)) {
      pendingPool.delete(config.url);
    }

    if (!err) {
      return Promise.reject(err);
    }

    if (err.response) {
      err = handleError(err);
    }
    // 没有response(没有状态码)的情况
    // eg: 超时；断网；请求重复被取消；主动取消请求；
    else {
      // 错误信息err传入isCancel方法，可以判断请求是否被取消
      if (axios.isCancel(err)) {
        throw new axios.Cancel(err.message || `请求'${request.config.url}'被取消`);
      } else if (err.stack && err.stack.includes('timeout')) {
        err.message = '请求超时!';
      } else {
        err.message = '连接服务器失败!';
      }
    }

    return Promise.reject(err);
  }
);

request.clearPendingPool = (whiteList = []) => {
  if (!pendingPool.size) {
    return;
  }

  const pendingUrlList = Array.from(pendingPool.keys).filter((url) => {
    !whiteList.includes(url);
  });

  if (!pendingUrlList.length) {
    return;
  }

  // 清除掉所有非全局的pending状态下的请求
  pendingUrlList.forEach((url) => {
    const pending = pendingPool.get(url);
    if (!pending.global) {
      pending.cancelFn();
      pendingPool.delete(url);
    }
  });

  return pendingUrlList;
};

request.removeRequestInterceptors = () => {
  request.interceptors.request.eject = requestInterceptorId;
};

request.removeResponseInterceptors = () => {
  request.interceptors.response.eject = responseInterceptorId;
};

export { intactRequest, request };
