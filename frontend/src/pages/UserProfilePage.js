import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaSave, FaKey } from 'react-icons/fa'; // Icons for the profile

const UserProfilePage = () => {
  const [user, setUser] = useState(null); // To store user profile data
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_number: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
  const [passwordChangeError, setPasswordChangeError] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address || '',
          contact_number: response.data.contact_number || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit profile update
  const handleSaveProfile = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/profile`, formData);
      setEditMode(false); // Exit edit mode after saving
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Submit password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordChangeSuccess('Password changed successfully.');
      setPasswordChangeError(null);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordChangeError('Failed to change password. Please check your current password.');
      setPasswordChangeSuccess(null);
    }
  };

  if (!user) return <p>Loading user profile...</p>;

  // Safe handling for credit_balance
  const creditBalance = user.credit_balance ? parseFloat(user.credit_balance) : 0.00;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">
        <FaUserEdit className="me-2" /> User Profile
      </h3>
      <div className="card shadow-sm p-4">
        <div className="mb-3">
          <strong>Name:</strong>{' '}
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-control"
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>
        <div className="mb-3">
          <strong>Employee ID:</strong> <span>{user.employee_id}</span>
        </div>
        <div className="mb-3">
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div className="mb-3">
          <strong>Address:</strong>{' '}
          {editMode ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-control"
            />
          ) : (
            <span>{user.address}</span>
          )}
        </div>
        <div className="mb-3">
          <strong>Contact Number:</strong>{' '}
          {editMode ? (
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              className="form-control"
            />
          ) : (
            <span>{user.contact_number}</span>
          )}
        </div>
        <div className="mb-3">
          <strong>Credit Balance:</strong> <span>₹{creditBalance.toFixed(2)}</span>
        </div>

        {/* Edit Profile Mode */}
        {editMode ? (
          <button className="btn btn-primary" onClick={handleSaveProfile}>
            <FaSave className="me-2" /> Save Profile
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={() => setEditMode(true)}>
            <FaUserEdit className="me-2" /> Edit Profile
          </button>
        )}
      </div>

      {/* Change Password Section */}
      <div className="card shadow-sm p-4 mt-4">
        <h4>
          <FaKey className="me-2" /> Change Password
        </h4>
        <form onSubmit={handleChangePassword}>
          <div className="mb-3">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="form-control"
              required
            />
          </div>
          {passwordChangeError && <p className="text-danger">{passwordChangeError}</p>}
          {passwordChangeSuccess && <p className="text-success">{passwordChangeSuccess}</p>}
          <button className="btn btn-primary" type="submit">
            Change Password
          </button>
        </form>
      </div>
      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white text-center">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} Canteen Management Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default UserProfilePage;
