const SOCKET = 'socket';
const GET_COLLECTIONS = 'fetch_collections';
const GET_COLLECTIONS_SUCCESS = 'fetch_collections_success';
const GET_COLLECTIONS_FAIL = 'fetch_collections_fail';

const initialState = [];

export default function reducer(state=initialState, action={}) {
  switch (action.type) {
    case GET_COLLECTIONS:
      console.log('fetching collections...');
      return state;

    case GET_COLLECTIONS_SUCCESS:
      return action.result;

    case GET_COLLECTIONS_FAIL:
      console.log(action.error);
      return state;

    default:
      return state;
  }
}

export function fetchCollections() {
  return {
    type: SOCKET,
    types: [GET_COLLECTIONS, GET_COLLECTIONS_SUCCESS, GET_COLLECTIONS_FAIL],
    promise: (socket) => socket.emit('getcollections', {})
  };
}
