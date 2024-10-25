import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data is available in localStorage on page load
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setCurrentUser(storedUser); // Set currentUser state if user data is available
      // Include the authentication token in Axios defaults if user data is available
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedUser.accessToken}`;
    }
  }, []);

  const handleAuthSuccess = (user, accessToken) => {
    setCurrentUser(user); // Store user data in currentUser state
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, accessToken })
    ); // Store user data including accessToken in localStorage
    // Set the accessToken in Axios defaults to be sent with every subsequent request
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/login`,
        credentials
      );
      const { accessToken, user } = res.data; 
      handleAuthSuccess(user, accessToken);
      navigate("/Customer");
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      if (error.response && error.response.status === 401) {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

const register = async (userData) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/user/addUser`,
      userData
    );
    const { accessToken, user } = res.data; 
    handleAuthSuccess(user, accessToken);
    toast.success("Registration successful");
    navigate("/Leave"); 
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response && error.response.status === 400) {
      toast.error(
        "Registration failed. Please check your input and try again."
      );
    } else {
      toast.error("Registration failed. Please try again later.");
    }
    // Do not navigate away from the current page on registration failure
  }
};

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/user/logout`);
      setCurrentUser(null);
      localStorage.removeItem("user");
      // Remove the accessToken from Axios defaults on logout
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again later.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
