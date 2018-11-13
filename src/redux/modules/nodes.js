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
import { composeEdges } from '../../utils';

const SET_CURRENT_NODE = 'set_current_node';
const CLEAR_CURRENT_NODE = 'clear_current_node';

const FIND_NODES = 'find_nodes';
const FIND_NODES_SUCCESS = 'find_nodes_success';
const FIND_NODES_FAIL = 'find_nodes_fail';

const CLEAR_NODES = 'clear_nodes';

const TRAVERSAL = 'traversal';
const TRAVERSAL_SUCCESS = 'traversal_success';
const TRAVERSAL_FAIL = 'traversal_fail';

const RESET_SUBNODES = 'reset_subnodes';

const initialState = {
  currentNode: null,
  nodeList: [],
  totalPages: 1,
  perPage: 10,
  currentPage: 1,
  searchOptions: {},
  subNodesByGraph: [],
  findLoaded: false,
  findLoading: false,
  traversalLoaded: false,
  traversalLoading: false
};

export default function reducer(state=initialState, action={}) {
  let data;

  switch (action.type) {
    case SET_CURRENT_NODE:
      return {
        ...state,
        currentNode: action.node
      }

    case CLEAR_CURRENT_NODE:
      return {
        ...state,
        currentNode: null
      }

    case FIND_NODES:
      console.log('find nodes...');
      return {
        ...state,
        findLoading: true
      };

    case FIND_NODES_SUCCESS:
      const { result, options } = action;
      data = result.data;

      return {
        ...state,
        nodeList: data.documents,
        totalPages: data.total_pages,
        perPage: data.total,
        currentPage: options.page,
        searchOptions: options,
        findLoaded: true,
        findLoading: false
      };

    case FIND_NODES_FAIL:
      console.log(action.error);
      return {
        ...state,
        nodeList: [],
        findLoaded: false,
        findLoading: false,
        error: action.error
      };

    case CLEAR_NODES:
      return {
        ...state,
        nodeList: []
      };

    case TRAVERSAL:
      console.log('traversal search...');
      return {
        ...state,
        traversalLoading: true
      }

    case TRAVERSAL_SUCCESS:
      data = action.result.data;

      const byGraphData = data.map((gData) => {
        gData.subnodes = gData.nodes.filter(n => n._id !== action.node._id).map((n) => {
          n.edges = composeEdges(n, gData.edges);
          n.edges.graph = gData.graph;
          return n;
        });
        return gData;
      });

      return {
        ...state,
        traversalLoaded: true,
        traversalLoading: false,
        subNodesByGraph: byGraphData
      }

    case TRAVERSAL_FAIL:
      console.log(action.error);
      return {
        ...state,
        traversalLoaded: false,
        traversalLoading: false,
        subNodesByGraph: action.graphs.map((graph) => {
          return { graph: graph.name, edges: [], nodes: [], subnodes: [] };
        })
      }

    case RESET_SUBNODES:
      return {
        ...state,
        subNodesByGraph: action.graphs.map((graph) => {
          return { graph: graph.name, edges: [], nodes: [], subnodes: [] };
        })
      }

    default:
      return state;
  }
}

export function setCurrentNode(node) {
  return {
    type: SET_CURRENT_NODE,
    node
  };
}

export function clearCurrentNode() {
  return {
    type: CLEAR_CURRENT_NODE
  };
}

export function findNodes(opts) {
  const options = _.merge({
    query: '',
    queryProps: [],
    collections: [],
    per_page: null,
    page: 1
  }, opts);

  return {
    types: [FIND_NODES, FIND_NODES_SUCCESS, FIND_NODES_FAIL],
    promise: (client) => client.get('/api/find-nodes', options),
    options
  };
}

export function clearNodes() {
  return {
    type: CLEAR_NODES
  };
}

export function traversalSearchWithGraphs(opts) {
  const options = _.merge({
    node: null,
    graphs: [],
    depth: 1
  }, opts);

  return {
    types: [TRAVERSAL, TRAVERSAL_SUCCESS, TRAVERSAL_FAIL],
    promise: (client) => client.post('/api/traversal-search', options),
    graphs: options.graphs,
    node: options.node
  }
}

export function traversalSearch(opts) {
  return (dispatch, getState) => {
    const options = _.merge({
      graphs: getState().app.graphs.map(g => g.name)
    }, opts);
    dispatch(traversalSearchWithGraphs(options));
  }
}

export function resetSubNodesFromGraphs(graphs) {
  return {
    type: RESET_SUBNODES,
    graphs
  }
}

export function resetSubNodes() {
  return (dispatch, getState) => {
    const graphs = getState().app.graphs;
    if (!graphs) {
      return;
    }
    dispatch(resetSubNodesFromGraphs(graphs));
  }
}
