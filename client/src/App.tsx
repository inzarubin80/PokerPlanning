// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Poker from './components/Poker/Poker';
import TaskForm from './components/TaskForm/TaskForm';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import YandexAuthCallback from './components/AuthCallback/AuthCallback';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';


const App: React.FC = () => {
  
  
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  console.log("accessToken----------------", accessToken)

  
  return (
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/YandexAuthCallback" element={<YandexAuthCallback />} /> 
        <Route element={<PrivateRoute accessToken={accessToken}/>}>
          <Route path="/" element={<Home />} />
          <Route path="poker/:pokerId" element={<Poker />} />
          <Route path="poker/:pokerId/task/:taskId" element={<TaskForm />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
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