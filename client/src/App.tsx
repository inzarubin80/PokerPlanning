// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext/AuthContext';
import Home from './components/Home/Home';
import Poker from './components/Poker/Poker';
import TaskForm from './components/TaskForm/TaskForm';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import YandexAuthCallback from './components/YandexAuthCallback/YandexAuthCallback';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/YandexAuthCallback" element={<YandexAuthCallback />} /> 
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="poker/:pokerId" element={<Poker />} />
          <Route path="poker/:pokerId/task/:taskId" element={<TaskForm />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
};

const NoMatch: React.FC = () => {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
};

export default App;