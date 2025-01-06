import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { signout, setUser } from "Redux-Store/authenticate/auth/authSlice"; 

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch(); 
  const { user, isAuthenticated } = useSelector((state) => state.auth); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser))); 
    }
    setLoading(false);
  }, [dispatch]);

  const logout = () => {
    dispatch(signout());
    localStorage.removeItem("user");
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};