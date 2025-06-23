import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../utils/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { userData } = useContext(AppContext)
  const navigate = useNavigate()

  const [showGetStarted, setShowGetStarted] = useState(false)

  useEffect(() => {
    // Only show Get Started if userData exists and button not clicked before
    const clicked = localStorage.getItem('getStartedClicked')
    if (userData && !clicked) {
      setShowGetStarted(true)
    }
  }, [userData])

  const handleGetStarted = () => {
    localStorage.setItem('getStartedClicked', 'true')
    setShowGetStarted(false)
    navigate('/dashboard')
  }

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.chef} alt='header-image' className='w-48 h-48 rounded-full mb-6' />
      <h1 className='flex items-center tracking-tighter text-xl sm:text-3xl font-medium mb-2'>
        Hey {userData ? userData.name : 'Student'} 👋
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to CalebEats LIVE!</h2>
      <p className='mb-8 max-w-md'>Let's get you started with a quick tour </p>
      {showGetStarted && (
        <button
          onClick={handleGetStarted}
          className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-200 transition-all'
        >
          Get Started
        </button>
      )}
    </div>
  )
}

export default Header
