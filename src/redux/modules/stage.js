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

import { uuid, traverseItems } from '../../utils';
import { setCurrentNode } from './nodes';

const SOCKET = 'socket';

const STAGE_ADD_NEW_NODE = 'stage_add_new_node';
const STAGE_REMOVE_NODE = 'stage_remove_node';
const STAGE_SET_NODES = 'stage_set_nodes';
const STAGE_CLEAN_NODES = 'stage_clean_nodes';

const SAVE_SHARED_MAP = 'save_shared_map';
const SAVE_SHARED_MAP_SUCCESS = 'save_shared_map_success';
const SAVE_SHARED_MAP_FAIL = 'save_shared_map_fail';

const GET_SHARED_MAP = 'get_shared_map';
const GET_SHARED_MAP_SUCCESS = 'get_shared_map_success';
const GET_SHARED_MAP_FAIL = 'get_shared_map_fail';

const initialState = {
  stageNodes: [],
  latestSharedMapKey: null,
  saveSharedLoading: false,
  saveSharedLoaded: false,
  getSharedLoading: false,
  getSharedLoaded: false
}

export default function reducer(state=initialState, action={}) {
  switch (action.type) {

    case STAGE_ADD_NEW_NODE:
      const { node, parentUuid } = action;
      let currentNodes = state.stageNodes.slice();

      if(parentUuid) {
        traverseItems(currentNodes, (n) => {
          if(n.uuid === parentUuid) {
            n.items.push(node);
          }
        });
      } else {
        node.root = true;
        currentNodes = [node];
      }

      return {
        ...state,
        stageNodes: currentNodes
      }

    case STAGE_REMOVE_NODE:
      currentNodes = state.stageNodes.slice();
      const i = currentNodes.findIndex((n) => {
        return n.uuid === action.node.uuid;
      });

      if (i >= 0) {
        currentNodes.splice(i, 1);
      } else {
        traverseItems(currentNodes, (n) => {
          const j = n.items.findIndex((n) => {
            return n.uuid === action.node.uuid;
          });
          if (j >= 0) {
            n.items.splice(j, 1);
          }
        });
      }

      // if (currentNodes.length > 0 && currentNodes[0].items !== undefined) {
      //   if (currentNodes[0].items.length === 0) {
      //     this.setCurrentTab('Search Results');
      //   }
      // }

      return {
        ...state,
        stageNodes: currentNodes
      };

    case STAGE_SET_NODES:
      return {
        ...state,
        stageNodes: action.stageNodes
      };

    case STAGE_CLEAN_NODES:
      return {
        ...state,
        stageNodes: []
      }

    case SAVE_SHARED_MAP:
      return {
        ...state,
        saveSharedLoading: true,
        saveSharedLoaded: false,
      }

    case SAVE_SHARED_MAP_SUCCESS:
      return {
        ...state,
        saveSharedLoading: false,
        saveSharedLoaded: true,
        latestSharedMapKey: action.result
      }

    case SAVE_SHARED_MAP_FAIL:
      return {
        ...state,
        saveSharedLoading: false,
        saveSharedLoaded: false,
        latestSharedMapKey: null
      }

    case GET_SHARED_MAP:
      return {
        ...state,
        getSharedLoading: true,
        getSharedLoaded: false
      }

    case GET_SHARED_MAP_SUCCESS:
      return {
        ...state,
        getSharedLoading: false,
        getSharedLoaded: true,
        stageNodes: action.result
      }

    case GET_SHARED_MAP_FAIL:
      return {
        ...state,
        getSharedLoading: false,
        getSharedLoaded: false,
        stageNodes: []
      }

    default:
      return state;
  }
}

export function addNewStageNode(node, parentUuid) {
  return {
    type: STAGE_ADD_NEW_NODE,
    node,
    parentUuid
  };
}

export function addStageNode(node, parentUuid, setCurrent=false) {
  return (dispatch, getState) => {
    if(stageHasNode(getState().stage.stageNodes, { node, parentUuid })) {
      dispatch(setCurrentNode(node));
      return;
    }
    node.uuid = uuid();
    node.items = node.items || [];
    dispatch(addNewStageNode(node, parentUuid));
    if (setCurrent) {
      dispatch(setCurrentNode(node));
    }
  }
}

export function removeStageNode(node) {
  return {
    type: STAGE_REMOVE_NODE,
    node
  }
}

export function setStageNodes(stageNodes) {
  return {
    type: STAGE_SET_NODES,
    stageNodes
  }
}

export function cleanStageNodes() {
  return {
    type: STAGE_CLEAN_NODES
  }
}

export function saveSharedMap(stageNodes) {
  return {
    type: SOCKET,
    types: [SAVE_SHARED_MAP, SAVE_SHARED_MAP_SUCCESS, SAVE_SHARED_MAP_FAIL],
    promise: (socket) => socket.emit('savesharedmap', { value: stageNodes })
  };
}

export function getSharedMap(key) {
  return {
    type: SOCKET,
    types: [GET_SHARED_MAP, GET_SHARED_MAP_SUCCESS, GET_SHARED_MAP_FAIL],
    promise: (socket) => socket.emit('getsharedmap', { key: key })
  };
}

// Selectors?
export function stageHasNode(stageNodes, { node, parentUuid }) {
  let ids = stageNodes.map(n => n._id);
  if (parentUuid !== undefined) {
    traverseItems(stageNodes, (n) => {
      if (n.uuid === parentUuid) {
        ids = n.items.map(n => n._id);
      }
    });
  }
  return !(ids.indexOf(node._id) < 0);
}

export function getStageNode(stageNodes, { node, parentUuid }) {
  let foundNode = false;
  traverseItems(stageNodes, (n) => {
    if(n.uuid === node.uuid) {
      foundNode = n;
    }
  });
  if (!foundNode && parentUuid !== undefined) {
    traverseItems(stageNodes, (n) => {
      if (n.uuid === parentUuid) {
        for (let i in n.items) {
          if (node._id === n.items[i]._id) {
            foundNode = n.items[i];
          }
        }
      }
    });
  }
  return foundNode;
}
