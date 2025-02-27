import './App.css'
import Index from './components/Home';
import Header from './components/shared/Header';
import { Routes, Route } from "react-router-dom";
import Footer from './components/shared/Footer';
import { ToastContainer } from 'react-toastify';
import Customization from './components/Customization';
import ProductDetail from './components/ProductDetail';
import Products from './components/Products';
import Catrgory from './components/Products/Category';
import Dashboard from './components/Dashboard';
import Users from './components/Admin/Users';
import AdminProducts from './components/Admin/Products';
import MyProducts from './components/Garage/Products';
import Cart from './components/User/Cart';
import ProductMainDetail from './components/Products/Detail';
import Checkout from './components/Checkout';
import Orders from './components/Admin/Orders';
import MyOrders from './components/MyOrders';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Brands from './components/Admin/Brands';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/custom" element={<Customization />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Catrgory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/brands" element={<Brands />} />
        <Route path="/dashboard/products" element={<AdminProducts />} />
        <Route path="/dashboard/my-products" element={<MyProducts />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/my-orders" element={<MyOrders />} />
        <Route path="/dashboard/cart" element={<Cart />} />
        <Route path="/:id" element={<ProductMainDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>

  )
}

export default App
