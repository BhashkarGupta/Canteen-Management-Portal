import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal } from 'react-bootstrap'; // For modal, form, and buttons

const UserManagement = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    employee_id: '',
    email: '',
    password: '',
    address: '',
    contact_number: '',
    role: 'user'
  });
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [credit, setCredit] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [currentRole, setCurrentRole] = useState('');

  // Check if the logged-in user is an admin or root
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
        setCurrentRole(response.data.role);
        setIsAdmin(response.data.role === 'admin');
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  // Handle input change for new user creation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  // Handle new user creation submission
  const handleCreateUser = async () => {
    try {
      const endpoint = currentRole === 'admin'
        ? `${process.env.REACT_APP_API_URL}/users/register/admin`
        : `${process.env.REACT_APP_API_URL}/users/register/root`;

      await axios.post(endpoint, userDetails);
      alert('User created successfully');
      setUserDetails({
        name: '',
        employee_id: '',
        email: '',
        password: '',
        address: '',
        contact_number: '',
        role: 'user'
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/reset-password`, {
        email: resetEmail,
        newPassword: resetPassword,
      });
      alert('Password reset successfully');
      setShowResetModal(false);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

    // Handle credit update
    const creditUpdate = async () => {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/users/update-credit`, {
          email: resetEmail,
          credit: credit,
        });
        alert('Credit updated successfully');
        setCredit(false);
      } catch (error) {
        console.error('Error credit update:', error);
      }
    };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-md-8">
        <h3 className="mb-4">User Management</h3>

        {/* Create New User Form */}
        <div className="card shadow-sm p-4 mb-4">
          <h5>Create New User</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee ID"
                name="employee_id"
                value={userDetails.employee_id}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={userDetails.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter address"
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter contact number"
                name="contact_number"
                value={userDetails.contact_number}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={userDetails.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="cook">Cook</option>
                {currentRole === 'root' && <option value="root">Root</option>}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" onClick={handleCreateUser}>
              Create User
            </Button>
          </Form>
        </div>

        {/* Reset Password Button */}
        <Button variant="danger" onClick={() => setShowResetModal(true)}>
          Reset User Password
        </Button>{'\t'} 

        {/* Reset Password Modal */}
        <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter user's email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Reset Password Button */}
        <Button variant="danger" onClick={() => setShowCreditModal(true)}>
          Add Credit
        </Button>

        {/* Add Credit Modal */}
        <Modal show={showCreditModal} onHide={() => setShowCreditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Credit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter user's email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Credit</Form.Label>
              <Form.Control
                type="float"
                placeholder="Enter credit to be added"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={creditUpdate}>
              Add Credit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
