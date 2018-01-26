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

const SET_MAIN_TAB = 'set_main_tab';
const SET_EXT_TAB = 'set_ext_tab';

const initialState = {
  mainTabs: [],
  currentMainTab: 'Search Results',
  extTabs: [],
  currentExtTab: 'Properties'
};

export default function reducer(state=initialState, action={}) {
  switch (action.type) {
    case SET_MAIN_TAB:
      return {
        ...state,
        currentMainTab: action.tabName
      }

    case SET_EXT_TAB:
      return {
        ...state,
        currentExtTab: action.tabName
      }

    default:
      return state;
  }
}

export function setMainTab(tabName) {
  return {
    type: SET_MAIN_TAB,
    tabName
  }
}

export function setExtTab(tabName) {
  return {
    type: SET_EXT_TAB,
    tabName
  }
}
