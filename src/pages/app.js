import Home from './home.js';
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './about.js';
import Contact from './contact.js';
import Map from './map.js';
import '../styles/main.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
