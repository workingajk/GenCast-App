import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PlayerPage from './pages/PlayerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { authService } from './services/api';

const ProtectedRoute = ({ children }) => {
    // Simple check, real app might verify token validity
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="player" element={<PlayerPage />} />
            <Route path="podcast/:id" element={<PlayerPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


