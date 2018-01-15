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
