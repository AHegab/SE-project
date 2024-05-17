import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Footer from './Footer.js';
import Header from './Header.js';
import ProductDetailPage from './routes/ProductDetailPage';
import Home from './routes/Home';
import Login from './routes/Login';
import Profile from "./routes/UserProfile.jsx"
import Product from './routes/Products';
import ContactUs from './routes/ContactUs';
import AddProduct from './routes/AddProduct';
import Register from './routes/Register';
import FeedbackList from './routes/FeedbackList';
import UserProfile from './routes/UserProfile';
import PlaceOrderPage from './routes/PlaceOrderPage'
import Admins from './routes/Admins'
import ViewAllOrders from './routes/ViewAllOrders'
import PastOrders from './routes/PastOrders'
import viewAdminsReqs from './routes/ViewAdminsReqs'
import UserRoleUpdate from './routes/UserRoleUpdate'
const App = ()=> {
  return (
    <div>
        <Router>
        <Header />
          
            
            <Routes>
              <Route path='/' exact Component={Home}></Route>
              <Route path='/login' exact Component={Login}></Route>
              <Route path='/Product' exact Component={Product}></Route>
              <Route path='/ContactUs' exact Component={ContactUs}></Route>
              <Route path='/Register' exact Component={Register}></Route>
              <Route path='/AddProduct' exact Component={AddProduct}></Route>
              <Route path='/FeedbackList' exact Component={FeedbackList}></Route>
              <Route path='/PlaceOrderPage' exact Component={PlaceOrderPage}></Route>
              <Route path='/UserProfile' exact Component={UserProfile}></Route>
              <Route path='/admin' exact Component={Admins}></Route>
              <Route path='/ViewAllOrders' exact Component={ViewAllOrders}></Route>
              <Route path='/PastOrders' exact Component={PastOrders}></Route>
              <Route path='/viewAdminsReqs' exact Component={viewAdminsReqs}></Route>
              <Route path='/UserRoleUpdate' exact Component={UserRoleUpdate}></Route>
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>

          <Footer />
        </Router>
    </div>
  );
}

export default App;