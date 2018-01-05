import _ from 'lodash';

const SOCKET = 'socket';
const FIND_NODES = 'find_nodes';
const FIND_NODES_SUCCESS = 'find_nodes_success';
const FIND_NODES_FAIL = 'find_nodes_fail';

const initialState = {
  nodeList: [],
  stageNodes: [],
  currentNode: null,
  loaded: false
};

export default function reducer(state=initialState, action={}) {
  switch (action.type) {
    case FIND_NODES:
      console.log('searching for nodes...');
      return {
        ...state,
        loading: true
      };

    case FIND_NODES_SUCCESS:
      return {
        ...state,
        nodeList: action.result.documents,
        loaded: true,
        loading: false
      };

    case FIND_NODES_FAIL:
      console.log(action.error);
      return {
        ...state,
        nodeList: [],
        loaded: false,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}

export function findNodes(opts) {
  let options = _.merge({
    query: '',
    queryProps: [],
    collections: [],
    per_page: null,
    page: 1
  }, opts);

  return {
    type: SOCKET,
    types: [FIND_NODES, FIND_NODES_SUCCESS, FIND_NODES_FAIL],
    promise: (socket) => socket.emit('findnodes', options)
  };
}
