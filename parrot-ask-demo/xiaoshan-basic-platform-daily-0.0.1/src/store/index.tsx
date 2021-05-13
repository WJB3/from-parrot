import React, { createContext, useReducer, useContext, Context, Dispatch } from 'react';
import { GlobalState, initialState, GlobalReducer } from './reducer';
import GT from 'types';

const GlobalContext: Context<[GlobalState, Dispatch<GT.Model.Action<any>>]> = createContext([
  initialState,
  (value) => {},
]);

const GlobalProvider = ({
  reducer,
  initialState,
  children,
}: {
  reducer: GlobalReducer;
  initialState: GlobalState;
  children: any;
}) => {
  return (
    <GlobalContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalState = () => useContext(GlobalContext);

export { GlobalContext, GlobalProvider, useGlobalState };

export * from './reducer';
export * from './actions';
