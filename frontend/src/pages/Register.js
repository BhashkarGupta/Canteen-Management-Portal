// src/pages/Register.js
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const { register: registerUser } = useContext(AuthContext);
  const password = watch('password', '');

  const onSubmit = (data) => {
    // Exclude confirmPassword from the data sent to the backend
    const { confirmPassword, ...userData } = data;
    registerUser(userData);
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name<span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        {/* Employee ID Field */}
        <div className="mb-3">
          <label htmlFor="employee_id" className="form-label">Employee ID<span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.employee_id ? 'is-invalid' : ''}`}
            id="employee_id"
            {...register('employee_id', { required: 'Employee ID is required' })}
          />
          {errors.employee_id && <div className="invalid-feedback">{errors.employee_id.message}</div>}
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address<span className="text-danger">*</span></label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              }
            })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password<span className="text-danger">*</span></label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password<span className="text-danger">*</span></label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
        </div>

        {/* Address Field (Optional) */}
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <textarea
            className="form-control"
            id="address"
            rows="3"
            {...register('address')}
          ></textarea>
        </div>

        {/* Contact Number Field (Optional) */}
        <div className="mb-3">
          <label htmlFor="contact_number" className="form-label">Contact Number</label>
          <input
            type="text"
            className="form-control"
            id="contact_number"
            {...register('contact_number', {
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Contact number must be 10 digits',
              }
            })}
          />
          {errors.contact_number && <div className="invalid-feedback">{errors.contact_number.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Register</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => { reset(); }}>Reset</button>
      </form>
      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white text-center">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} Canteen Management Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default Register;
