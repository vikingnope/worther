import logo from './logo.png';
import './App.css';
import Link from './Link.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <td onClick={() => <Link/>} className="App-text">
          Worther, coming soon!
        </td>
      </header>
    </div>
  );
}

export default App;
