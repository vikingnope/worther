import Home from './home.jsx';
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './about.jsx';
import Contact from './contact.jsx';
import Map from './map.jsx';
import Forums from './forums.jsx';
import '../styles/main.scss';
import Weather from './weather.jsx';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/map" element={<Map />} />
        <Route exact path="/forums" element={<Forums />} />
        <Route exact path="/weather" element={<Weather />} />
      </Routes>
    </Router>
  );
}