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

import throttle from 'lodash/throttle';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  BrowserRouter,
  Route,
  Switch } from 'react-router-dom';
import reducer from './redux/modules/reducer';
import clientMiddleware from './redux/middlewares/clientMiddleware';
import ApiClient from './helpers/ApiClient';
import {
  App,
  AppFull,
  NotFound } from './components';
import { loadState, saveState } from './utils/localStorage';
import { turnOffLoadings } from './utils';

const apiClient = new ApiClient()
const persistedState = turnOffLoadings(loadState());

export const store = createStore(
  reducer,
  persistedState,
  applyMiddleware(
    thunk,
    clientMiddleware(apiClient)
  )
);

store.subscribe(throttle(() => {
  saveState({
    stage: store.getState().stage
  });
}, 1000));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/map/:mapKey" component={AppFull} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
);
