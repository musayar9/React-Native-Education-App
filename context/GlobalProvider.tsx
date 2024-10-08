import { getCurrentUser } from "@/lib/appwrite";
import React, { createContext, useContext, useEffect, useState } from "react";




const initialState = {
  isLoggedIn: false,
  setIsLoggedIn: (value:boolean) => {},
  user: null,
  setUser: (value:any) => {},
  isLoading: true,
};
const GlobalContext = createContext(initialState);

export const useGlobalContext = () => useContext(GlobalContext);

 const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setIsLoggedIn(false);
        setUser(null);
      }).finally(()=>{
      setIsLoading(false)
      })
  }, []);
  return <GlobalContext.Provider value={{
  isLoggedIn, setIsLoggedIn,  user, setUser, isLoading
  
  }}>{children}</GlobalContext.Provider>;
};


export default GlobalProvider;