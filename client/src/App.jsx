import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/auth' element={<Auth />}/>
        <Route path='/verify-email' element={<EmailVerify />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/password-reset' element={<ResetPassword />}/>
      </Routes>
    </div>
  )
}

export default App