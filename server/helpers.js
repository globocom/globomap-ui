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
      let token = null;

      if (session.tokenData !== undefined) {
        token = session.tokenData.access_token;
      } else {
        reject("getUserInfo: Undefined session tokenData");
      }

      if (!url) {
        reject("getUserInfo: oauthUserInfoUrl is null");
      }

      axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    })
    .catch((error) => {
      console.log(error);
    });
  }

}
