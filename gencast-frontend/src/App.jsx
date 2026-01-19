import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PlayerPage from './pages/PlayerPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-10">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/editor">Editor</Link>
            </li>
            <li>
              <Link to="/player">Player</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/player" element={<PlayerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
