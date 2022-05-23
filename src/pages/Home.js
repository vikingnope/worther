import '../styles/Home.css';
import logo from '../resources/logo.png';
import React from 'react';


const Home = () => {
  return (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="m-20 App-logo" alt="logo" />
            <p className="uppercase font-bold text-5xl">
                Worther, coming soon!
            </p>
            <a href="/about" className="uppercase font-bold text-4xl underline">
                About
            </a>
        </header>
    </div>
  );
}

export default Home;