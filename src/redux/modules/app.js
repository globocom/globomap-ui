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

import _ from 'lodash';
import { sortByName, getEdgeLinks } from '../../utils';

const SOCKET = 'socket';

const FETCH_GRAPHS = 'fetch_graphs';
const FETCH_GRAPHS_SUCCESS = 'fetch_graphs_success';
const FETCH_GRAPHS_FAIL = 'fetch_graphs_fail';

const FETCH_COLLECTIONS = 'fetch_collections';
const FETCH_COLLECTIONS_SUCCESS = 'fetch_collections_success';
const FETCH_COLLECTIONS_FAIL = 'fetch_collections_fail';

const FETCH_EDGES = 'fetch_edges';
const FETCH_EDGES_SUCCESS = 'fetch_edges_success';
const FETCH_EDGES_FAIL = 'fetch_edges_fail';

const FETCH_QUERIES = 'fetch_queries';
const FETCH_QUERIES_SUCCESS = 'fetch_queries_success';
const FETCH_QUERIES_FAIL = 'fetch_queries_fail';

const GET_SERVER_DATA = 'get_server_data';
const GET_SERVER_DATA_SUCCESS = 'get_server_data_success';
const GET_SERVER_DATA_FAIL = 'get_server_data_fail';

const TOGGLE_GRAPH = 'toggle_graph';
const TOGGLE_HASID = 'toggle_hasid';
const SHOW_MODAL = 'show_modal';
const CLOSE_MODAL = 'close_modal';

const initialState = {
  graphs: [],
  collections: [],
  queries: [],
  edges: [],
  collectionsByGraphs: {},
  enabledCollections: [],
  selectedCollections: [],
  serverData: {},
  hasId: false,
  modalVisible: false,
  modalContent: null
};

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
        enabledCollections,
        namedGraphs: _.mapKeys(action.result, 'name')
      };

    case FETCH_GRAPHS_FAIL:
      console.log(action.error);
      return {
        ...state,
        graphs: []
      };

    case FETCH_COLLECTIONS:
      console.log('fetch collections...');
      return state;

    case FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        collections: action.result,
        namedCollections: _.mapKeys(action.result, 'name')
      };

    case FETCH_COLLECTIONS_FAIL:
      console.log(action.error);
      return {
        ...state,
        collections: []
      };

    case FETCH_EDGES:
      console.log('fetch edges...');
      return state;

    case FETCH_EDGES_SUCCESS:
      return {
        ...state,
        edges: action.result,
        namedEdges: _.mapKeys(action.result, 'name')
      };

    case FETCH_EDGES_FAIL:
      console.log(action.error);
      return {
        ...state,
        edges: []
      };

    case FETCH_QUERIES:
      console.log('fetch queries...');
      return state;

    case FETCH_QUERIES_SUCCESS:
      return {
        ...state,
        queries: action.result.documents
      };

    case FETCH_QUERIES_FAIL:
      console.log(action.error);
      return {
        ...state,
        queries: []
      };

    case GET_SERVER_DATA:
      console.log('get server data...');
      return state;

    case GET_SERVER_DATA_SUCCESS:
      return {
        ...state,
        serverData: action.result
      };

    case GET_SERVER_DATA_FAIL:
      console.log(action.error);
      return {
        ...state,
        serverData: {}
      };

    case TOGGLE_GRAPH:
      const newGraphs = state.graphs.map((graph) => {
        if(graph.name === action.name) {
          graph.enabled = !graph.enabled;
        }
        return graph;
      });

      let selectedCollections = [];
      newGraphs.forEach((graph, index) => {
        if (graph.enabled) {
          selectedCollections = selectedCollections.concat(getEdgeLinks(graph));
        }
      });

      return {
        ...state,
        graphs: newGraphs,
        selectedCollections: _.uniq(selectedCollections)
      };

    case TOGGLE_HASID:
      return {
        ...state,
        hasId: !state.hasId
      };

    case SHOW_MODAL:
      return {
        ...state,
        modalVisible: true,
        modalContent: action.content
      }

    case CLOSE_MODAL:
      return {
        ...state,
        modalVisible: false,
        modalContent: null
      }

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

export function fetchEdges() {
  return {
    type: SOCKET,
    types: [FETCH_EDGES, FETCH_EDGES_SUCCESS, FETCH_EDGES_FAIL],
    promise: (socket) => socket.emit('getedges', {})
  };
}

export function fetchQueries() {
  return {
    type: SOCKET,
    types: [FETCH_QUERIES, FETCH_QUERIES_SUCCESS, FETCH_QUERIES_FAIL],
    promise: (socket) => socket.emit('getqueries', {})
  };
}

export function getServerData() {
  return {
    type: SOCKET,
    types: [GET_SERVER_DATA, GET_SERVER_DATA_SUCCESS, GET_SERVER_DATA_FAIL],
    promise: (socket) => socket.emit('getserverdata', {})
  };
}

export function toggleGraph(name) {
  return {
    type: TOGGLE_GRAPH,
    name
  };
}

export function toggleHasId() {
  return {
    type: TOGGLE_HASID
  };
}

export function showModal(content) {
  return {
    type: SHOW_MODAL,
    content
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

