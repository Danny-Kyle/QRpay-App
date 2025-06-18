import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const {backendURI} = useContext(AppContext)
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [emailSent, setEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = useRef  ([]);
  
    const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    };
  
    function handleKeyDown(e, index) {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  
    function handlePaste(e) {
      const paste = e.clipboardData.getData("text");
      const pasteArray = paste.split("");
      pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });
    }

    async function handleEmailSubmit(e){
      e.preventDefault();
      try {
        const {response} = await axios.post(backendURI + '/api/auth/send-reset-otp', {otp})
        if(response.success){
          toast.success(response.message)
        }else {
          toast.error(response.message)
        }

        response.success && setEmailSent(true)
      } catch (error) {
        toast.error(error.message)
      }
    }

    async function onSubmitOTP(e){
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmitted(true)
    }

    async function onSubmitNewPassword (e){
      e.preventDefault();
      try {
        const {response} = await axios.post(backendURI + '/api/auth/reset-password', {email, otp, newPassword})
        if(response.success){
          toast.success(response.message)
        }else{
          toast.error(response.error)
        }

        response.success && navigate('/auth')
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-pink-300">
      <img
        src={assets.logo}
        alt="lock"
        className="w-28 sm:w-20 absolute left-5 sm:left-20 top-5 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {!emailSent && 


      <form onSubmit={handleEmailSubmit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-3xl font-semibold text-amber-50 text-center mb-4">
          Reset Password
        </h1>
        <p className="text-center text-sm mb-6 text-amber-50">
          Enter your registered email address:
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt="email" className="w-3 h-3"/>
          <input type="email" placeholder="Email Address" className="bg-transparent outline-none text-amber-50" value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-pink-200 to-zinc-500 text-amber-50 rounded-full">
          Submit
        </button>
      </form>
}
{/*PASSWORD REST OTP FORM HANLDER */}
{!isOtpSubmitted && emailSent &&
      <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-3xl font-semibold text-amber-50 text-center mb-4">
          Reset Password Otp
        </h1>
        <p className="text-center text-sm mb-6 text-amber-50">
          Enter the code sent to your email address.
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md "
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-pink-200 to-zinc-500 text-amber-50 rounded-full">
          Proceed
        </button>
      </form>
}
      {/* FORM TO ALLOW user choose or enter a new password */}

      {isOtpSubmitted && emailSent && 
      <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-3xl font-semibold text-amber-50 text-center mb-4">
          New Password
        </h1>
        <p className="text-center text-sm mb-6 text-amber-50">
          Enter your new password:
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt="email" className="w-3 h-3"/>
          <input type="password" placeholder="New Password" className="bg-transparent outline-none text-amber-50" value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-pink-200 to-zinc-500 text-amber-50 rounded-full">
          Submit
        </button>
      </form>
}
    </div>
  );
};

export default ResetPassword;
