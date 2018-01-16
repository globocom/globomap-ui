import io from 'socket.io-client';
import config from '../config';

export default class socketAPI {
  socket;

  constructor(options = { connect: false }) {
    if (options.connect) {
      this.socket = io();
    }
  }

  connect() {
    this.socket = io.connect(config.host, { path: config.socketPath });
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => resolve());
      this.socket.on('connect_error', (error) => reject(error));
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve();
      });
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject('No socket connection.');
      }

      return this.socket.emit(event, data, (response) => {
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }

        return resolve(response);
      });
    });
  }

  on(event, fn) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject('No socket connection.');
      }

      this.socket.on(event, fn);
      resolve();
    });
  }

}
