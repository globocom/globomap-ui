const SOCKET = 'socket';

const GET_GRAPHS = 'fetch_graphs';
const GET_GRAPHS_SUCCESS = 'fetch_graphs_success';
const GET_GRAPHS_FAIL = 'fetch_graphs_fail';

const GET_COLLECTIONS = 'fetch_collections';
const GET_COLLECTIONS_SUCCESS = 'fetch_collections_success';
const GET_COLLECTIONS_FAIL = 'fetch_collections_fail';

const TOGGLE_GRAPH = 'toggle_graph';

const initialState = {
  graphs: [],
  collections: []
}

export default function reducer(state=initialState, action={}) {
  switch (action.type) {
    case GET_GRAPHS:
      console.log('fetching graphs...');
      return state;

    case GET_GRAPHS_SUCCESS:
      let graphs = [];

      action.result.forEach((item, index) => {
        graphs.push({
          name: item.name,
          colorClass: 'graph-color' + index,
          enabled: false
        });
      });

      return {
        ...state,
        graphs
      };

    case GET_GRAPHS_FAIL:
      console.log(action.error);
      return {
        ...state,
        error: action.error
      };

    case GET_COLLECTIONS:
      console.log('fetching collections...');
      return state;

    case GET_COLLECTIONS_SUCCESS:
      return {
        ...state,
        collections: action.result
      };

    case GET_COLLECTIONS_FAIL:
      console.log(action.error);
      return {
        ...state,
        error: action.error
      };

    case TOGGLE_GRAPH:
      const newGraphs = state.graphs.map((graph) => {
        if(graph.name === action.name) {
          graph.enabled = !graph.enabled;
        }
        return graph;
      });

      return {
        ...state,
        graphs: newGraphs
      };

    default:
      return state;
  }
}

export function fetchGraphs() {
  return {
    type: SOCKET,
    types: [GET_GRAPHS, GET_GRAPHS_SUCCESS, GET_GRAPHS_FAIL],
    promise: (socket) => socket.emit('getgraphs', {})
  };
}

export function fetchCollections() {
  return {
    type: SOCKET,
    types: [GET_COLLECTIONS, GET_COLLECTIONS_SUCCESS, GET_COLLECTIONS_FAIL],
    promise: (socket) => socket.emit('getcollections', {})
  };
}

export function toggleGraph(name) {
  return {
    type: TOGGLE_GRAPH,
    name
  };
}
