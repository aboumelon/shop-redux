import { Route, Routes } from "react-router-dom";
import "./App.css";

// components
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/product-detail/ProductDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
