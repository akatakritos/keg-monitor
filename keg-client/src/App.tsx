import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import TapsPage from './Taps/TapsPage';
import { AdminPage, AdminPageHook } from './Admin/AdminPage';

function App() {
  return (
    <Router>
      <Route path="/" exact component={TapsPage} />
      <Route path="/admin/" component={AdminPageHook} />
    </Router>
  );
}

export default App;
