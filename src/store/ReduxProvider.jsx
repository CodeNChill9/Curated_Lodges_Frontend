"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<>{children}</>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
