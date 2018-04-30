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

module.exports = {
  environment: process.env.ENVIRONMENT || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'secret',
  certificates: process.env.CERTIFICATES || `${process.cwd()}/server/ca-certificates.crt`,

  // API
  globomapApiUrl: process.env.GLOBOMAP_API_URL || 'http://localhost:5000/v1',
  globomapApiUsername: process.env.GLOBOMAP_API_USERNAME,
  globomapApiPassword: process.env.GLOBOMAP_API_PASSWORD,

  // Redis
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
  redisPassword: process.env.REDIS_PASSWORD,
  redisSentinelsPort: process.env.REDIS_SENTINELS_PORT || 26379,
  redisSentinelsService: process.env.REDIS_SENTINELS_SERVICE,
  redisSentinelsHosts: process.env.REDIS_SENTINELS
                        ? process.env.REDIS_SENTINELS.split(',')
                        : null,

  // Redis Auth
  redisAuthHost: process.env.REDIS_AUTH_HOST || 'localhost',
  redisAuthPort: process.env.REDIS_AUTH_PORT || 6379,
  redisAuthPassword: process.env.REDIS_AUTH_PASSWORD,
  redisAuthSentinelsPort: process.env.REDIS_AUTH_SENTINELS_PORT || 26379,
  redisAuthSentinelsService: process.env.REDIS_AUTH_SENTINELS_SERVICE,
  redisAuthSentinelsHosts: process.env.REDIS_AUTH_SENTINELS
                            ? process.env.REDIS_AUTH_SENTINELS.split(',')
                            : null,

  // OAuth
  oauthLogoutUrl: process.env.OAUTH_LOGOUT_URL,
  oauthForceAuth: process.env.OAUTH_FORCE === 'true',
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  accessTokenUri: process.env.OAUTH_TOKEN_URL,
  authorizationUri: process.env.OAUTH_AUTHORIZE_URL,
  redirectUri: process.env.OAUTH_REDIRECT_URL,
  oauthUserInfoUrl: process.env.OAUTH_USER_INFO_URL
};
