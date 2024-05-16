import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';

import Home from './routes/Home';
import Sidebar from './routes/SideBar';
import Navbar from './routes/NavBar';


const App = ()=> {
  return (
    <div>
        <Router>
          <Routes>
          <Route path='/' exact Component={Home}></Route>
          <Route path='/sidebar' exact Component={Sidebar}></Route>
          <Route path='/navbar' exact Component={Navbar}></Route>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
