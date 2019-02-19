/*
Copyright 2018 Globo.com

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

const axios = require('axios');
const oauthClient = require('./oauthClient');
const config = require('./config');

module.exports = {

  updateItemInfo: function(item) {
    item.type = item._id.split('/')[0];
    delete item._key;
    delete item._rev;
    return item;
  },

  isAuthenticated: function(req, res, next) {
    if (config.environment !== 'production') {
      return next();
    }

    if (req.session && req.session.tokenData) {
      oauthClient.isAuthenticated(req.session, isAuthenticated => {
        if (isAuthenticated) {
          next();
        } else {
          return res.redirect('/logout');
        }
      });
    } else {
      return res.redirect('/auth');
    }
  },

  getUserInfo: function(session) {
    const url = config.oauthUserInfoUrl;

    return new Promise((resolve, reject) => {
      if (session.userInfo !== undefined) {
        resolve(session.userInfo);
        return;
      }

      if (config.environment !== 'production') {
        resolve({
          "email": "local@localhost",
          "picture": "/images/user.png"
        });
        return;
      }

      let token = null;
      if (session.tokenData !== undefined) {
        token = session.tokenData.access_token;
      } else {
        reject("getUserInfo: Undefined session tokenData");
      }

      if (!url) {
        reject("getUserInfo: oauthUserInfoUrl is null");
      }

      axios.get(url, { headers: { 'Authorization': `Bearer ${token}`} })
        .then(response => {
          session.userInfo = response.data;
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  }

}
