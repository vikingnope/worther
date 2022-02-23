import logo from './logo.png';
import './App.css';
import Link from './Link.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-text">
          Worther, coming soon!
        </p>
        <a href="Link.js" className="App-text-about">
          About
        </a>
      </header>
    </div>
  );
}

export default App;
