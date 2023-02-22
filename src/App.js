import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Users from './Components/Users';
import Dashboard from './Components/Dashboard';
import './App.css';
import Recharge from './Components/Recharge';
import Login from './Components/Login';
import Withdrawal from './Components/Withdrawal';
import SessionSapre from './Components/SessionSapre';
import SessionParity from './Components/SessionParity';
import SessionBcone from './Components/SessionBcone';
import SessionEmerd from './Components/SessionEmerd';
import Complaints from './Components/Complaints';
import Bonus from './Components/Bonus.js';


const App= ()=> {

  return (
  <>
   <Routes>
    <Route path='/dashboard' element={<Dashboard/>}></Route>
    <Route path='/user' element={<Users/>}></Route>
    <Route path='/recharge' element={<Recharge/>}></Route>
    <Route path='/withdrawal' element={<Withdrawal/>}></Route>
    <Route path='/sessions/parity' element={<SessionParity/>}></Route>
    <Route path='/sessions/sapre' element={<SessionSapre/>}></Route>
    <Route path='/sessions/bcone' element={<SessionBcone/>}></Route>
    <Route path='/sessions/emerd' element={<SessionEmerd/>}></Route>
    <Route path='/complains' element={<Complaints/>}></Route>
    <Route path='/bonus' element={<Bonus/>}></Route>
    <Route path='/' element={<Login/>}></Route>
   </Routes>
    </>
  );
}

export default App;