import { combineReducers } from 'redux';

import { reducer as form } from 'redux-form';
import app from './app';
import nodes from './nodes';
import stage, * as fromStage from './stage';
import tabs from './tabs';

const rootReducer = combineReducers({
  form,
  app,
  nodes,
  stage,
  tabs
});

export default rootReducer;

// Selectors from stage
export const stageHasNode = (state, params) =>
  fromStage.stageHasNode(state.stage, params);

export const getStageNode = (state, params) =>
  fromStage.getStageNode(state.stage, params);
