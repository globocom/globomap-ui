/*
Copyright 2019 Globo.com

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

const SET_TAB = 'set_tab';
const SET_FULL_TAB = 'set_full_tab';
const TOGGLE_FULL_TAB = 'toggle_full_tab';
const CLOSE_TAB = 'close_tab';
const REGISTER_TAB = 'register_tab';

const initialState = {
  tabs: [],
  currentTab: 'home',
  lastTab: null,
  fullTab: false
};

export default function reducer(state=initialState, action={}) {
  switch (action.type) {

    case SET_TAB:
      return {
        ...state,
        currentTab: action.tabKey,
        lastTab: state.currentTab
      }

    case SET_FULL_TAB:
      return {
        ...state,
        currentTab: action.tabKey,
        fullTab: true
      }

    case TOGGLE_FULL_TAB:
      return {
        ...state,
        fullTab: !state.fullTab
      }

    case CLOSE_TAB:
      return {
        ...state,
        currentTab: state.lastTab,
        lastTab: 'home'
      }

    case REGISTER_TAB:
      const hasTab = state.tabs.includes(action.tabKey);
      return {
        ...state,
        tabs: hasTab
                ? [...state.tabs]
                : [...state.tabs, action.tabKey]
      }

    default:
      return state;
  }
}

export function setTab(tabKey) {
  return {
    type: SET_TAB,
    tabKey
  }
}

export function setFullTab(tabKey) {
  return {
    type: SET_FULL_TAB,
    tabKey
  }
}

export function toggleFullTab() {
  return {
    type: TOGGLE_FULL_TAB
  }
}

export function closeTab() {
  return {
    type: CLOSE_TAB
  }
}

export function registerTab(tabKey) {
  return {
    type: REGISTER_TAB,
    tabKey
  }
}
