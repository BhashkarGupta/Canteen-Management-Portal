import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, user, setUser } = useContext(AuthContext); // Ensure setUser is available to update user context
  const [loading, setLoading] = useState(false); // Add loading state for UX
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.role) {
      // Redirect based on role if user is already logged in
      redirectToDashboard(user.role);
    }
  }, [user]);

  // Function to redirect based on user role
  const redirectToDashboard = (role) => {
    if (role === 'user') {
      navigate('/dashboard');
    } else if (role === 'cook') {
      navigate('/cook-dashboard');
    } else if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'root') {
      navigate('/root-dashboard');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError('');
    try {
      // Perform login and set token
      await login(data.email, data.password);

      // Fetch user profile to get the role after login
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const loggedInUser = response.data;
      setUser(loggedInUser); // Update the user in the AuthContext

      // Redirect based on the user role
      redirectToDashboard(loggedInUser.role);
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Login</h2>
            {loginError && <div className="alert alert-danger">{loginError}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
