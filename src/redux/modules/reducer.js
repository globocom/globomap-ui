import { combineReducers } from 'redux';

import { reducer as form } from 'redux-form';
import graphs from './graphs';
import collections from './collections';
import nodes from './nodes';

const rootReducer = combineReducers({
  form,
  graphs,
  collections,
  nodes
});

export default rootReducer;
