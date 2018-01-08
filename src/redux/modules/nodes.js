import _ from 'lodash';

const SOCKET = 'socket';

const SET_CURRENT_NODE = 'set_current_node';
const CLEAR_CURRENT_NODE = 'clear_current_node';

const FIND_NODES = 'find_nodes';
const FIND_NODES_SUCCESS = 'find_nodes_success';
const FIND_NODES_FAIL = 'find_nodes_fail';

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
  subNodesByGraph: [],
  findLoaded: false,
  traversalLoaded: false
};

export default function reducer(state=initialState, action={}) {
  switch (action.type) {
    case SET_CURRENT_NODE:
      return {
        ...state,
        currentNode: { _id: action.node._id, uuid: action.node.uuid }
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
      const { result, page } = action;

      return {
        ...state,
        nodeList: result.documents,
        totalPages: result.total_pages,
        perPage: result.total,
        currentPage: page,
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

    case TRAVERSAL:
      console.log('traversal search...');
      return {
        ...state,
        traversalLoading: true
      }

    case TRAVERSAL_SUCCESS:
      const composeEdges = (node, edges) => {
        let nEdges = { in: [], out: [] };
        for(let i=0, l=edges.length; i<l; ++i) {
          let edge = edges[i];

          if(node._id === edge._to) {
            edge.dir = 'in';
            nEdges.in.push(edge);
          }

          if(node._id === edge._from) {
            edge.dir = 'out';
            nEdges.out.push(edge);
          }
        }
        return nEdges;
      }

      const data = action.result;

      return {
        ...state,
        traversalLoaded: true,
        traversalLoading: false,
        subNodesByGraph: data.map((gData) => {
          gData.subnodes = gData.nodes.filter(n => n._id !== action.node._id).map((n) => {
            n.edges = composeEdges(n, gData.edges);
            n.edges.graph = gData.graph;
            return n;
          });
          return gData;
        })
      }

    case TRAVERSAL_FAIL:
      console.log(action.error);
      return {
        ...state,
        traversalLoaded: false,
        traversalLoading: false,
        subNodesByGraph: action.graphs.map((graph) => {
          return { graph: graph, edges: [], nodes: [], subnodes: [] };
        })
      }

    case RESET_SUBNODES:
      return {
        ...state,
        subNodesByGraph: action.graphs.map((graph) => {
          return { graph: graph, edges: [], nodes: [], subnodes: [] };
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
    type: SOCKET,
    types: [FIND_NODES, FIND_NODES_SUCCESS, FIND_NODES_FAIL],
    promise: (socket) => socket.emit('findnodes', options),
    page: options.page
  };
}

export function traversalSearch(opts) {
  const options = _.merge({
    node: null,
    graphs: [],
    depth: 1
  }, opts);

  return {
    type: SOCKET,
    types: [TRAVERSAL, TRAVERSAL_SUCCESS, TRAVERSAL_FAIL],
    promise: (socket) => socket.emit('traversalsearch', options),
    node: options.node,
    graphs: options.graphs
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
