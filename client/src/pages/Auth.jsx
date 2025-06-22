import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../utils/AppContext'
import axios from 'axios'
import { toast} from 'react-toastify';

const Auth = () => {

  const navigate = useNavigate()

  const {backendURI, setIsLoggedIn, getUserData} = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e)=>{
    e.preventDefault();

    try {
      let response;
      let successMessage;
      let errorMessage;

      axios.defaults.withCredentials = true;

      if(state === "Sign Up"){
        response = await axios.post(backendURI + '/api/auth/register', {name, email, password});
        successMessage = "Registration Successful! Welcome!!"
        errorMessage = "Registration Failed, please try again"
    }else {
      response = await axios.post(backendURI + '/api/auth/login', {email, password});
      successMessage = "Login Successful! Redirecting.........";
      errorMessage = "Login Failed. Please check your credentials"
    }

    if(response.data.success){
      setIsLoggedIn(true);
      getUserData();
      toast.success(successMessage);
      navigate("/");
    }else {
      toast.error(response.data.message || errorMessage)
    }
  } catch (error) {
      if(error.response){
        toast.error(error.response.data.message || "An unexpected error has occurred.")
      }else if (error.request){
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("Error setting up the request")
      }
      console.error("Authentication error:", error);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-pink-300'>
      <img src={assets.logo} alt='lock' className='w-28 sm:w-20 absolute left-5 sm:left-20 top-5 cursor-pointer' onClick={()=> navigate("/")}/>
      
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96  text-amber-50 text-sm'>
        <h2 className='text-3xl font-semibold text-amber-50 text-center mb-4'>{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create new Account" : "Login to your account"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.user} alt="User" className='w-6'/>
            <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none text-white' type="text" placeholder='Full Name' required/>
          </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="Mail Icon" className='w-6' />
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white' type="Email" placeholder='Email Address' required/>
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="password" className='w-6'/>
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none text-white' type="password" placeholder='Password' required/>
          </div>
          <p onClick={()=> navigate("/password-reset")} className='cursor-pointer mb-4 text-amber-50'>Forgot Password?</p>
          <button className='w-full py-2.5 rounded-full text-amber-50 cursor-pointer transition ease-in-out font-medium hover:bg-gradient-to-tr from-sky-300 to-emerald-200 hover:text-slate-900'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='mt-6 text-amber-50 text-center text-xs'>Already have an account?{' '}
          <span onClick={()=>setState("Login")} className='text-blue-400 cursor-pointer underline'>Login Here</span>
        </p>
        ) : (
          <p className='mt-6 text-amber-50 text-center text-xs'>Don't have an account?{' '}
          <span onClick={()=>setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>
        )}
        
      </div>
      </div>
  )
}

export default Auth