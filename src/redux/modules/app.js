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

import _ from 'lodash';
import {
  saveLocal,
  sortByName,
  getEdgeLinks } from '../../utils';

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

const GET_TOUR_STATUS = 'get_tour_status';
const GET_TOUR_STATUS_SUCCESS = 'get_tour_status_success';
const GET_TOUR_STATUS_FAIL = 'get_tour_status_fail';

const SET_TOUR_STATUS = 'set_tour_status';
const SAVE_TOUR_STATUS = 'save_tour_status';
const SAVE_TOUR_STATUS_SUCCESS = 'save_tour_status_success';
const SAVE_TOUR_STATUS_FAIL = 'save_tour_status_fail';

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
  serverData: {
    environment: '',
    userInfo: {
      email: '',
      picture: ''
    }
  },
  tourStatus: true,
  tourStatusLoading: false,
  hasId: false,
  modalVisible: false,
  modalContent: null,
  modalShowCloseButton: true,
  serverDataLoading: false,
  serverDataLoaded: false,
  collectionsLoading: false,
  collectionsLoaded: false,
  graphsLoading: false,
  graphsLoaded: false,
  edgesLoading: false,
  edgesLoaded: false,
  queriesLoading: false,
  queriesLoaded: false
};

export default function reducer(state=initialState, action={}) {
  switch (action.type) {

    case FETCH_GRAPHS:
      console.log('fetch graphs...');
      return {
        ...state,
        graphsLoading: true
      }

    case FETCH_GRAPHS_SUCCESS:
      let graphs = sortByName(action.result.data);
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
        namedGraphs: _.mapKeys(action.result, 'name'),
        graphsLoading: false,
        graphsLoaded: true
      };

    case FETCH_GRAPHS_FAIL:
      console.log(action.error);
      return {
        ...state,
        graphs: [],
        graphsLoading: false
      };

    case FETCH_COLLECTIONS:
      console.log('fetch collections...');
      return {
        ...state,
        collectionsLoading: true
      };

    case FETCH_COLLECTIONS_SUCCESS:
      const collections = action.result.data;
      return {
        ...state,
        collections: collections,
        namedCollections: _.mapKeys(collections, 'name'),
        collectionsLoading: false,
        collectionsLoaded: true
      };

    case FETCH_COLLECTIONS_FAIL:
      console.log(action.error);
      return {
        ...state,
        collections: [],
        collectionsLoading: false,
        collectionsLoaded: false
      };

    case FETCH_EDGES:
      console.log('fetch edges...');
      return {
        ...state,
        edgesLoading: true
      };

    case FETCH_EDGES_SUCCESS:
      const edges = action.result.data;
      return {
        ...state,
        edges: edges,
        namedEdges: _.mapKeys(edges, 'name'),
        edgesLoading: false,
        edgesLoaded: true
      };

    case FETCH_EDGES_FAIL:
      console.log(action.error);
      return {
        ...state,
        edges: [],
        edgesLoading: false,
        edgesLoaded: false
      };

    case FETCH_QUERIES:
      console.log('fetch queries...');
      return {
        ...state,
        queriesLoading: true
      };

    case FETCH_QUERIES_SUCCESS:
      return {
        ...state,
        queries: action.result.data,
        queriesLoading: false,
        queriesLoaded: true
      };

    case FETCH_QUERIES_FAIL:
      console.log(action.error);
      return {
        ...state,
        queries: [],
        queriesLoading: false,
        queriesLoaded: false
      };

    case GET_SERVER_DATA:
      console.log('get server data...');
      return {
        ...state,
        serverDataLoading: true
      };

    case GET_SERVER_DATA_SUCCESS:
      return {
        ...state,
        serverData: action.result.data,
        serverDataLoading: false,
        serverDataLoaded: true
      };

    case GET_SERVER_DATA_FAIL:
      console.log(action.error);
      return {
        ...state,
        serverData: {
          environment: '',
          userInfo: {
            email: '',
            picture: ''
          }
        },
        serverDataLoading: false,
        serverDataLoaded: false
      };

    case GET_TOUR_STATUS:
      console.log('get tour status...');
      return {
        ...state,
        tourStatusLoading: true
      }

    case GET_TOUR_STATUS_SUCCESS:
      let tourStatus = action.result.data.tour
      saveLocal('gmap.tour', tourStatus);

      return {
        ...state,
        tourStatus: tourStatus,
        tourStatusLoading: false
      };

    case GET_TOUR_STATUS_FAIL:
      console.log(action.error);
      return {
        ...state,
        tourStatus: false,
        tourStatusLoading: false
      };

    case SET_TOUR_STATUS:
      return {
        ...state,
        tourStatus: action.status
      };

    case SAVE_TOUR_STATUS:
      console.log('save tour status...');
      return state;

    case SAVE_TOUR_STATUS_SUCCESS:
      saveLocal('gmap.tour', action.status);
      return {
        ...state,
        tourStatus: action.status
      };

    case SAVE_TOUR_STATUS_FAIL:
      console.log(action.error);
      return {
        ...state,
        tourStatus: state.tourStatus
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
        modalContent: action.content,
        modalShowCloseButton: action.showCloseBtn
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

function fetchGraphsStart() {
  return {
    types: [FETCH_GRAPHS, FETCH_GRAPHS_SUCCESS, FETCH_GRAPHS_FAIL],
    promise: (client) => client.get('/api/graphs')
  };
}

export function fetchGraphs() {
  return (dispatch, getState) => {
    if (getState().app.graphsLoaded) {
      return;
    }
    return dispatch(fetchGraphsStart());
  }
}

function fetchCollectionsStart() {
  return {
    types: [FETCH_COLLECTIONS, FETCH_COLLECTIONS_SUCCESS, FETCH_COLLECTIONS_FAIL],
    promise: (client) => client.get('/api/collections')
  };
}

export function fetchCollections() {
  return (dispatch, getState) => {
    if (getState().app.collectionsLoaded) {
      return;
    }
    return dispatch(fetchCollectionsStart());
  }
}

function fetchEdgesStart() {
  return {
    types: [FETCH_EDGES, FETCH_EDGES_SUCCESS, FETCH_EDGES_FAIL],
    promise: (client) => client.get('/api/edges')
  };
}

export function fetchEdges() {
  return (dispatch, getState) => {
    if (getState().app.edgesLoaded) {
      return;
    }
    return dispatch(fetchEdgesStart());
  }
}

function fetchQueriesStart() {
  return {
    types: [FETCH_QUERIES, FETCH_QUERIES_SUCCESS, FETCH_QUERIES_FAIL],
    promise: (client) => client.get('/api/queries')
  };
}

export function fetchQueries() {
  return (dispatch, getState) => {
    if (getState().app.queriesLoaded) {
      return;
    }
    return dispatch(fetchQueriesStart());
  }
}

function getServerDataStart() {
  return {
    types: [GET_SERVER_DATA, GET_SERVER_DATA_SUCCESS, GET_SERVER_DATA_FAIL],
    promise: (client) => client.get('/tools/server-data')
  };
}

export function getServerData() {
  return (dispatch, getState) => {
    if (getState().app.serverDataLoaded) {
      return;
    }
    return dispatch(getServerDataStart());
  }
}

export function getTourStatus() {
  return {
    types: [GET_TOUR_STATUS, GET_TOUR_STATUS_SUCCESS, GET_TOUR_STATUS_FAIL],
    promise: (client) => client.get('/api/user/tour')
  };
}

export function setTourStatus(status) {
  return {
    type: SET_TOUR_STATUS,
    status
  };
}

export function saveTourStatus(status) {
  return {
    types: [SAVE_TOUR_STATUS, SAVE_TOUR_STATUS_SUCCESS, SAVE_TOUR_STATUS_FAIL],
    promise: (client) => client.post('/api/user/tour', { tour: status }),
    status
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

export function showModal(content, showCloseBtn=true) {
  return {
    type: SHOW_MODAL,
    content,
    showCloseBtn
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

