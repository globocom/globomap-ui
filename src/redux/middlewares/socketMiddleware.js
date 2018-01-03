export default function socketMiddleware(socket) {

  return ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, type, types, ...rest } = action;

    if (type !== 'socket' || !promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({...rest, type: REQUEST});

    return promise(socket)
      .then((result) => {
        return next({...rest, result, type: SUCCESS });
      })
      .catch((error) => {
        return next({...rest, error, type: FAILURE });
      })
  };

}
