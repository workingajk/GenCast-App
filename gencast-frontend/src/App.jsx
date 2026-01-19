import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PlayerPage from './pages/PlayerPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="player" element={<PlayerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
