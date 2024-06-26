import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';

import Home from './routes/Home';
import Login from './routes/Login';
import Header from './Header.js';
import Footer from './Footer.js';

const App = ()=> {
  return (
    <div>
        <Router>
        <Header />
          <Routes>
          <Route path='/' exact Component={Home}></Route>
          <Route path='/login' exact Component={Login}></Route>
          </Routes>
          <Footer />
        </Router>
    </div>
  );
}

export default App;