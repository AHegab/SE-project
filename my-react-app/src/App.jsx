import React from 'react';
import { Route, BrowserRouter as Router, Routes  } from 'react-router-dom';

import Footer from './Footer.js';
import Header from './Header.js';
import ProductDetailPage from './routes/ProductDetailPage';
import Home from './routes/Home';
import Login from './routes/Login';
import Profile from "./routes/UserProfile.jsx";
import Product from './routes/Products';
import ContactUs from './routes/ContactUs';
import AddProduct from './routes/AddProduct';
import Register from './routes/Register';
import FeedbackList from './routes/FeedbackList';
import UserProfile from './routes/UserProfile';
import PlaceOrderPage from './routes/PlaceOrderPage';
import Admins from './routes/Admins';
import ViewAllOrders from './routes/ViewAllOrders';
import PastOrders from './routes/PastOrders';
import ViewAdminsReqs from './routes/ViewAdminsReqs';
import UserRoleUpdate from './routes/UserRoleUpdate';
import UpdateProduct from './routes/UpdateProduct'; // Import the UpdateProduct component

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/FeedbackList" element={<FeedbackList />} />
          <Route path="/PlaceOrderPage" element={<PlaceOrderPage />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/admin" element={<Admins />} />
          <Route path="/ViewAllOrders" element={<ViewAllOrders />} />
          <Route path="/PastOrders" element={<PastOrders />} />
          <Route path="/viewAdminsReqs" element={<ViewAdminsReqs />} />
          <Route path="/UserRoleUpdate" element={<UserRoleUpdate />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product/update/:productId" element={<UpdateProduct />} /> {/* Add the UpdateProduct route */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
