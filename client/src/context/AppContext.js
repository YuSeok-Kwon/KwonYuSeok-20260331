import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  products: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  filters: {
    category_1: "",
    category_2: "",
    skin_concern: "",
    keyword: "",
    sort: "review_count",
  },
  skinConcerns: null,
  selectedProduct: null,
  chatMessages: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };
    case "SET_PAGE":
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };
    case "SET_SKIN_CONCERNS":
      return { ...state, skinConcerns: action.payload };
    case "SET_SELECTED_PRODUCT":
      return { ...state, selectedProduct: action.payload };
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
