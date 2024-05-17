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
              <Route path='/Profile' exact Component={Profile}></Route>
              {/* <Route path='/profile' exact Component={Profile}></Route> */}
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>

          <Footer />
        </Router>
    </div>
  );
}

export default App;