import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES_NEAR_ME: "SET_COFFEE_STORES_NEAR_ME",
};

const storeReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return {
        ...state,
        latLong: payload.latLong,
      };
    case ACTION_TYPES.SET_COFFEE_STORES_NEAR_ME:
      return {
        ...state,
        coffeeStoresNearMe: payload.coffeeStoresData,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeStoresNearMe: [],
  };
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
