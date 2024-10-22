import './bootstrap.js';
import './styles/app.css';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Component } from 'react';
import Menu from './controllers/blocks/navbar.js';
import Footer from './controllers/blocks/footer.js'; 
import Home from './controllers/pages/home';
import Profile from './controllers/pages/profile';
import Vehicle from './controllers/pages/vehicle';
import { userState } from './controllers/blocks/userprofile';

class App extends Component {
    render() {
      return (
        <Router>
          <Menu />
            <div style={{ minHeight: '1500px' }}>
                <Routes>
                        <Route path="/profile" element={<Profile user={userState.user} />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/:type/:id" element={<Vehicle />} />
                </Routes>
            </div>
          <Footer />
        </Router>
      );
    }
  }
  export default ReactDOM.render(<App />, document.getElementById('body'));
