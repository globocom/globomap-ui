const SOCKET = 'socket';
const GET_GRAPHS = 'fetch_graphs';
const GET_GRAPHS_SUCCESS = 'fetch_graphs_success';
const GET_GRAPHS_FAIL = 'fetch_graphs_fail';
const TOGGLE_GRAPH = 'toggle_graph';

const initialState = [];

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

      return graphs;

    case GET_GRAPHS_FAIL:
      console.log(action.error);
      return state;

    case TOGGLE_GRAPH:
      const newState = state.map((graph) => {
        if(graph.name === action.name) {
          graph.enabled = !graph.enabled;
        }
        return graph;
      });

      return newState;

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

export function toggleGraph(name) {
  return {
    type: TOGGLE_GRAPH,
    name
  };
}
