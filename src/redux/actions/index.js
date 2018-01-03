import io from 'socket.io-client';

export const SOCKET = 'socket';

export const GET_GRAPHS = 'fetch_graphs';
export const GET_GRAPHS_SUCCESS = 'fetch_graphs_success';
export const GET_GRAPHS_FAIL = 'fetch_graphs_fail';

export const GET_COLLECTIONS = 'fetch_collections';
export const GET_COLLECTIONS_SUCCESS = 'fetch_collections_success';
export const GET_COLLECTIONS_FAIL = 'fetch_collections_fail';

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
