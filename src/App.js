import Home from './Home.js';
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './About.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
