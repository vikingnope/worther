import './Home.css';
import logo from './logo.png';
import React from 'react';


const Home = () => {
  return (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p className="underline text-white">
                Worther, coming soon!
            </p>
            <a href="/about" className="App-text-about">
                About
            </a>
        </header>
    </div>
  );
}

export default Home;