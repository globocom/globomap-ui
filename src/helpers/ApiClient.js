import axios from 'axios';
// import config from '../config'

export default class ApiClient {

  constructor() {
    ['get', 'post', 'del'].forEach((method) => {
      this[method] = (path, params = {}) => {
        return axios[method](this.formatUrl(path), { params: params });
      }
    })
  }

  formatUrl(path) {
    return path[0] !== '/' ? `/api/${path}` : `/api${path}`;
  }

}
