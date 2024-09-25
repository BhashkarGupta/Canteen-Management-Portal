import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap'; // For modal and form

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(3);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    // Fetch all announcements
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/announcements`);
        setAnnouncements(response.data);
        setFilteredAnnouncements(response.data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        console.log(error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter((announcement) =>
        announcement.title.toLowerCase().includes(term) ||
        announcement.content.toLowerCase().includes(term)
      );
      setFilteredAnnouncements(filtered);
    }
  };

  // Handle pagination
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle edit announcement
  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowEditModal(true);
  };

  // Submit edit announcement
  const handleSubmitEdit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/announcements/${selectedAnnouncement.id}`, selectedAnnouncement);
      alert('Announcement updated successfully');
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  // Handle delete announcement
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/announcements/${id}`);
      alert('Announcement deleted successfully');
      setFilteredAnnouncements(filteredAnnouncements.filter(ann => ann.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  // Handle create announcement
  const handleCreate = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/announcements`, newAnnouncement);
      alert('Announcement created successfully');
      setShowCreateModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Announcement Management</h3>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button variant="success" onClick={() => setShowCreateModal(true)}>Create Announcement</Button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="row">
        {currentAnnouncements.length > 0 ? (
          currentAnnouncements.map(announcement => (
            <div className="col-md-4 mb-4" key={announcement.announcement_id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{announcement.title}</h5>
                  <p>{announcement.content.slice(0, 100)}... 
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => alert(announcement.content)}>
                      Show more
                    </span>
                  </p>
                  <p><strong>Creator:</strong> {announcement.creator?.name}</p>
                  <p><strong>Created At:</strong> {new Date(announcement.createdAt).toLocaleDateString()}</p>
                  <p><strong>Updated At:</strong> {new Date(announcement.updatedAt).toLocaleDateString()}</p>
                  <Button variant="primary" onClick={() => handleEdit(announcement)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(announcement.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No announcements found.</p>
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredAnnouncements.length / announcementsPerPage) }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Edit Announcement Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={selectedAnnouncement?.title || ''}
                onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={selectedAnnouncement?.content || ''}
                onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, content: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmitEdit}>Save changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Create Announcement Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleCreate}>Create Announcement</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AnnouncementManagement;
