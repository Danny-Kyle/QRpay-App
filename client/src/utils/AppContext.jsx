import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendURI = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async() => {
        try {
            const { data } = await axios.get(backendURI + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    const getUserData = async() => {
        try {
            const response = await axios.get(backendURI + '/api/user/data')
            response.data.success ? setUserData(response.data.userData) : toast.error(response.data.message || "Failed to Load user data")
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message || "Failed to load user data")
            }else if (error.request){
                toast.error("Network error: Could not connect to the server")
            } else {
                toast.error("An unexpected error occurred")
            }
        }
    }

    const value = {
        backendURI,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}