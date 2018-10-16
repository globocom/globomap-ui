import axios from 'axios';
import { host } from '../config'

export default class ApiClient {

  constructor() {
    ['get', 'post', 'delete'].forEach((method) => {
      this[method] = (path, params = {}) => {
        return axios[method](this.formatUrl(path), { params: params });
      }
    })
  }

  formatUrl(path) {
    path = path[0] !== '/' ? `/${path}` : path;
    return `${host}${path}`;
  }

}
