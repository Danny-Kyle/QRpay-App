import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
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
        <Route path='/demo-checkout' element={
          <main className="mx-auto max-w-lg p-8">
            <h1 className="text-3xl font-bold">QRpay checkout demo</h1>
            <p className="my-4">
              This QR code opens a demo. To see a sample receipt, return to the
              device with the open cart and select Simulate checkout. No money moves.
            </p>
            <Link className="underline" to="/">Back to QRpay</Link>
          </main>
        }/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/password-reset' element={<ResetPassword />}/>
      </Routes>
    </div>
  )
}

export default App