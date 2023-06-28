import React, { createContext, useContext, useDebugValue, useMemo, useRef } from 'react';
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';

const createStoreImpl = (initialState) => {
  let state;
  const subscribers = [];

  const setState = (partial, replace) => {
    const nextState =
      typeof partial === 'function'
        ? partial(state)
        : partial
    if (!Object.is(nextState, state)) {
      const previousState = state
      state =
        replace ?? typeof nextState !== 'object'
          ? (nextState)
          : Object.assign({}, state, nextState)
      subscribers.forEach((subscriber) => subscriber(state, previousState));
    };
  }

  const getState = () => state;

  const subscribe = (subscriber) => {
    subscribers.push(subscriber);
    return () => {
      const index = subscribers.indexOf(subscriber);
      subscribers.splice(index, 1);
    };
  };

  const api = { setState, getState, subscribe }
  state = initialState(setState, getState, api)
  return api;
};

const createStore = ((createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl)

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

function useStore(api, selector = api.getState, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}

const create = (createState) => {
  const createImpl = (createStateFn) => {
    const api = typeof createStateFn === 'function' ? createStore(createStateFn) : createStateFn;

    const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);

    Object.assign(useBoundStore, api);

    return useBoundStore;
  };

  return createState ? createImpl(createState) : createImpl;
};

/** -------------------------------------------- */

const createZustandContext = () => {
  const ZustandContext = createContext(undefined)

  const Provider = ({ createStore, children }) => {
    const storeRef = useRef()

    if (!storeRef.current) {
      storeRef.current = createStore()
    }

    return (
      <ZustandContext.Provider value={storeRef.current}>
        {children}
      </ZustandContext.Provider>
    )
  }

  const useContextStore = (selector, equalityFn) => {
    const store = useContext(ZustandContext)

    return useStore(
      store,
      selector,
      equalityFn
    )
  }

  const useStoreApi = () => {
    const store = useContext(ZustandContext)
    return useMemo(() => ({ ...store }), [store])
  }

  return {
    Provider,
    useStore: useContextStore,
    useStoreApi
  }
};

/** -------------------------------------------- */

const persist = () => {

}

export { create, createZustandContext, persist };