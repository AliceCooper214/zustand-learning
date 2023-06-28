import React from 'react';
import { create, createZustandContext } from './zustand';

const { Provider, useStore } = createZustandContext()

const createStore = () => create((set, get, api) => (
  {
    count: 1,
    inc: () => set(state => ({ count: state.count + 1 })),
  }
));

const MyComponent = () => {
  const { count, inc } = useStore()

  return (
    <div>
      <span>{count}</span>
      <button onClick={inc}>one up</button>
    </div>
  );
};

function App() {
  return (
    <Provider createStore={createStore}>
      <MyComponent />
    </Provider>
  );
}

export default App;