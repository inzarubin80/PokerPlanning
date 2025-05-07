// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Poker from './components/Poker/Poker';
import UserCard from './components/UserCard/UserCard';
import TaskForm from './components/TaskForm/TaskForm';
import StartPoker from './components/StartPoker/StartPoker';

import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import MainLayout from './components/MainLayout/MainLayout';
import YandexAuthCallback from './components/AuthCallback/AuthCallback';

import { useSelector } from 'react-redux';
import { RootState } from './app/store';

const App: React.FC = () => {

  const accessToken = useSelector((state: RootState) => state.userReducer.accessToken);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/YandexAuthCallback" element={<YandexAuthCallback />} />

      <Route element={<MainLayout />}>
        <Route element={<PrivateRoute accessToken={accessToken} />}>
        
          <Route index element={<Home />} />
          <Route path="new" element={<StartPoker />} />
          <Route path="poker"> 
            <Route path=":pokerId" element={<Poker />} />
            <Route path=":pokerId/task/:taskId" element={<TaskForm />} />
          </Route>
          <Route path="user" element={<UserCard />} />

        </Route>
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

const NoMatch: React.FC = () => {
  return (
    <div>
      <h2>Привет!!! это не наш путь</h2>
      <p>
        <Link to="/">Пойдем на главную страницу</Link>
      </p>
    </div>
  );
};

export default App;