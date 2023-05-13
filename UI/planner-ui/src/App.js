import logo from './logo.svg';
import { Users } from './components/Users';
import { Projects } from './components/Projects';
import DenseAppBar from './components/AppBar';
import BasicGrid from './components/Layout';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <DenseAppBar />
      <BasicGrid Users={<Users />} Projects={<Projects />} />
    </div>
  );
}

export default App;
