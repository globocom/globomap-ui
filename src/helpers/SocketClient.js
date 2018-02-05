/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import io from 'socket.io-client';
import config from '../config';

export default class socketAPI {

  constructor(options = { connect: false }) {
    this.socket = null;
    if (options.connect) {
      this.connect()
        .then((result) => {
          console.log('socketAPI: connected');
        })
        .catch((error) => {
          console.log(`socketAPI Error: ${error}`);
        });
    }
  }

  connect() {
    this.socket = io.connect(config.host, { path: config.socketPath });
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => resolve());
      this.socket.on('error', (error) => reject(error));
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
        if (response instanceof Object && response.error) {
          console.error(response.message);
          return reject(response);
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
