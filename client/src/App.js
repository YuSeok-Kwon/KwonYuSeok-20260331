import React, { useEffect, useState, useCallback } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { fetchProducts } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FilterBar from "./components/FilterBar";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import ChatPanel from "./components/ChatPanel";
import "./App.css";

function Main() {
  const { state, dispatch } = useApp();
  const { filters, pagination } = state;
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.category_1) params.category_1 = filters.category_1;
      if (filters.category_2) params.category_2 = filters.category_2;
      if (filters.skin_concern) params.skin_concern = filters.skin_concern;
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.sort) params.sort = filters.sort;

      const data = await fetchProducts(params);
      dispatch({ type: "SET_PRODUCTS", payload: data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "제품을 불러오지 못했습니다." });
    }
  }, [filters, pagination.page, pagination.limit, dispatch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <FilterBar />
        <ProductGrid onProductClick={setSelectedProduct} />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <ChatPanel />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}

export default App;
