import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const { backendURI, isLoggedIn, getUserData, userData } =
    useContext(AppContext);

  const inputRefs = useRef([]);

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

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendURI + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedIn, userData])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-pink-300">
      <img
        src={assets.logo}
        alt="lock"
        className="w-28 sm:w-20 absolute left-5 sm:left-20 top-5 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-3xl font-semibold text-amber-50 text-center mb-4">
          Email Verify Otp
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
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
