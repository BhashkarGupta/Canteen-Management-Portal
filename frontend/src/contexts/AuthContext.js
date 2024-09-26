// // src/contexts/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // Create the Auth Context
// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   // Load user from localStorage if available
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     if (storedToken) {
//       setToken(storedToken);
//       try {
//         const decoded = jwt_decode(storedToken);
//         setUser({
//           id: decoded.userId,
//           role: decoded.role,
//           name: decoded.name,
//           email: decoded.email,
//         });
//         // Set axios default headers
//         axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//       } catch (error) {
//         console.error('Invalid token:', error);
//         // Handle invalid token scenario
//         logout();
//       }
//     }
//   }, []);

//   // Function to handle user login
//   const login = async (email, password) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
//         email,
//         password,
//       });

//       const receivedToken = response.data.token;
//       const decoded = jwt_decode(receivedToken);

//       // Update state
//       setToken(receivedToken);
//       setUser({
//         id: decoded.userId,
//         role: decoded.role,
//         name: decoded.name,
//         email: decoded.email,
//       });

//       // Store token in localStorage
//       localStorage.setItem('token', receivedToken);

//       // Set axios default header
//       axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

//       toast.success('Logged in successfully!');
//       navigate('/dashboard'); // Redirect to dashboard or desired route
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error(
//         error.response?.data?.message || 'An error occurred during login.'
//       );
//     }
//   };

//   // Function to handle user registration
//   const register = async (userData) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, userData);

//       toast.success('Registered successfully! You can now log in.');
//       navigate('/login'); // Redirect to login page after successful registration
//     } catch (error) {
//       console.error('Registration error:', error);
//       toast.error(
//         error.response?.data?.message || 'An error occurred during registration.'
//       );
//     }
//   };

//   // Function to handle logout
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     toast.info('Logged out successfully.');
//     navigate('/login'); // Redirect to login page
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Create the Auth Context
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user from localStorage if available
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwt_decode(storedToken);
        setUser({
          id: decoded.userId,
          role: decoded.role,
          name: decoded.name,
          email: decoded.email,
        });
        // Set axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Invalid token:', error);
        // Handle invalid token scenario
        logout();
      }
    }
  }, []);

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
        email,
        password,
      });

      const receivedToken = response.data.token;
      const decoded = jwt_decode(receivedToken);

      // Update state
      setToken(receivedToken);
      setUser({
        id: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      });

      // Store token in localStorage
      localStorage.setItem('token', receivedToken);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message || 'An error occurred during login.'
      );
    }
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully.');
    navigate('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
