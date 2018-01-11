import _ from 'lodash';
import { sortByName, getEdgeLinks } from '../../utils';

const SOCKET = 'socket';

const FETCH_GRAPHS = 'fetch_graphs';
const FETCH_GRAPHS_SUCCESS = 'fetch_graphs_success';
const FETCH_GRAPHS_FAIL = 'fetch_graphs_fail';

const FETCH_COLLECTIONS = 'fetch_collections';
const FETCH_COLLECTIONS_SUCCESS = 'fetch_collections_success';
const FETCH_COLLECTIONS_FAIL = 'fetch_collections_fail';

const TOGGLE_GRAPH = 'toggle_graph';

const initialState = {
  graphs: [],
  collections: [],
  collectionsByGraphs: {},
  enabledCollections: []
}

export default function reducer(state=initialState, action={}) {
  switch (action.type) {
    case FETCH_GRAPHS:
      console.log('fetch graphs...');
      return state;

    case FETCH_GRAPHS_SUCCESS:
      let graphs = sortByName(action.result);
      let collectionsByGraphs = {};
      let enabledCollections = [];

      graphs.forEach((graph, index) => {
        let colls = getEdgeLinks(graph);

        graphs[index].colorClass = 'graph-color-' + index;
        graphs[index].enabled = false;

        enabledCollections = enabledCollections.concat(colls);
        collectionsByGraphs[graph.name] = _.uniq(colls);
      });

      return {
        ...state,
        graphs,
        collectionsByGraphs,
        enabledCollections
      };

    case FETCH_GRAPHS_FAIL:
      console.log(action.error);
      return {
        ...state,
        error: action.error
      };

    case FETCH_COLLECTIONS:
      console.log('fetch collections...');
      return state;

    case FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        collections: action.result
      };

    case FETCH_COLLECTIONS_FAIL:
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
    types: [FETCH_GRAPHS, FETCH_GRAPHS_SUCCESS, FETCH_GRAPHS_FAIL],
    promise: (socket) => socket.emit('getgraphs', {})
  };
}

export function fetchCollections() {
  return {
    type: SOCKET,
    types: [FETCH_COLLECTIONS, FETCH_COLLECTIONS_SUCCESS, FETCH_COLLECTIONS_FAIL],
    promise: (socket) => socket.emit('getcollections', {})
  };
}

export function toggleGraph(name) {
  return {
    type: TOGGLE_GRAPH,
    name
  };
}
