import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Pagination } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VenueManagementPage = () => {
    const [venueRequests, setVenueRequests] = useState([]);
    const [venues, setVenues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentRequestPage, setCurrentRequestPage] = useState(1);
    const [currentVenuePage, setCurrentVenuePage] = useState(1);
    const requestItemsPerPage = 4;
    const venueItemsPerPage = 3;
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedVenueRequest, setSelectedVenueRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [filterStatus, setFilterStatus] = useState(null); // For status filter

    // Fetch all venue bookings
    useEffect(() => {
        const fetchVenueRequests = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/venue-bookings`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setVenueRequests(response.data);
                setFilteredRequests(response.data);
            } catch (error) {
                console.error('Error fetching venue requests:', error);
            }
        };

        fetchVenueRequests();
    }, []);

    // Fetch all venues
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/venues`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setVenues(response.data);
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, []);
    const [allVenues, setAllVenues] = useState([]);
    useEffect(() => {
        // Fetch all venues
        const fetchVenues = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/venues`);
                setVenues(response.data);
                setAllVenues(response.data); // Save the full list of venues for resetting
            } catch (error) {
                console.error('Failed to fetch venues:', error);
            }
        };

        fetchVenues();
    }, []);

    // Search for venue requests by user/venue name or booking ID
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = venueRequests.filter(request =>
            request.Venue.venue_name.toLowerCase().includes(term) ||
            request.User.name.toLowerCase().includes(term) ||
            request.id.toString().includes(term)
        );
        setFilteredRequests(filtered);
    };
    // Venue Search Handler (Separate from venue requests search)
    const handleVenueSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === '') {
            // If the search term is cleared, reset to show all venues
            setVenues(allVenues); // Reset to the original list of all venues
        } else {
            const filteredVenues = allVenues.filter(venue =>
                (venue.venue_name && venue.venue_name.toLowerCase().includes(term)) ||
                (venue.venue_id && venue.venue_id.toString().includes(term))
            );
            setVenues(filteredVenues); // Filter and set venues only if term is present
        }
    };




    // Filter venue requests by date
    const handleFilterByDate = (date) => {
        setSelectedDate(date);
        if (date) {
            const filtered = venueRequests.filter(request => {
                const bookingDate = new Date(request.booking_date);
                return bookingDate.toDateString() === date.toDateString();
            });
            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(venueRequests);
        }
    };

    // Clear the date filter
    const clearDateFilter = () => {
        setSelectedDate(null);
        setFilteredRequests(venueRequests);
    };

    // Approve or reject a venue request
    const handleApproveReject = (venueRequest, status) => {
        setSelectedVenueRequest({ ...venueRequest, status });
        setShowCommentModal(true);
    };

    const handleSubmitComment = async () => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/venue-bookings/${selectedVenueRequest.id}/status`,
                { status: selectedVenueRequest.status, admin_comment: comment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(`Venue booking ${selectedVenueRequest.status}`);
            setFilteredRequests(filteredRequests.map(req =>
                req.id === selectedVenueRequest.id ? { ...req, status: selectedVenueRequest.status } : req
            ));
            setShowCommentModal(false);
            setComment('');
        } catch (error) {
            console.error('Error updating venue booking:', error);
        }
    };

    // Delete a venue
    const handleDeleteVenue = async (venue_id) => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/venues/${venue_id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setVenues(venues.filter(venue => venue.venue_id !== venue_id));
                alert('Venue deleted successfully');
            } catch (error) {
                console.error('Error deleting venue:', error);
            }
        }
    };

    // Add a new venue
    const [newVenue, setNewVenue] = useState({ venue_name: '', location: '', description: '' });
    const handleAddVenue = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/venues`, newVenue, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Venue added successfully');
            setVenues([...venues, newVenue]);
            setNewVenue({ venue_name: '', location: '', description: '' });
        } catch (error) {
            console.error('Error adding venue:', error);
        }
    };

    // Status filter
    const handleFilterByStatus = (status) => {
        if (filterStatus === status) {
            setFilterStatus(null); // Clear filter if clicked again
            setFilteredRequests(venueRequests);
        } else {
            setFilterStatus(status);
            const filtered = venueRequests.filter(request => request.status === status);
            setFilteredRequests(filtered);
        }
    };

    // Pagination logic for venue requests
    const indexOfLastRequest = currentRequestPage * requestItemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestItemsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

    // Pagination logic for venues
    const indexOfLastVenue = currentVenuePage * venueItemsPerPage;
    const indexOfFirstVenue = indexOfLastVenue - venueItemsPerPage;
    const currentVenues = venues.slice(indexOfFirstVenue, indexOfLastVenue);

    // Handle page change for venue requests
    const paginateRequests = (pageNumber) => setCurrentRequestPage(pageNumber);

    // Handle page change for venues
    const paginateVenues = (pageNumber) => setCurrentVenuePage(pageNumber);

    // Get status count
    const getStatusCount = (status) => venueRequests.filter(request => request.status === status).length;

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Venue Management</h3>

            {/* Venue Requests Section */}
            <div className="mb-4">
                <h5>Venue Requests</h5>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by user, venue name, or booking ID"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="d-flex align-items-center mb-3">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleFilterByDate}
                        placeholderText="Filter by date"
                        className="form-control"
                    />
                    <button className="btn btn-danger ms-3" onClick={clearDateFilter}>
                        Clear Date Filter
                    </button>
                </div>

                {/* Status Filter Buttons */}
                <div className="d-flex mb-3">
                    <button className={`btn ${filterStatus === 'approved' ? 'btn-info' : 'btn-outline-info'} me-2`} onClick={() => handleFilterByStatus('approved')}>
                        Approved ({getStatusCount('approved')})
                    </button>
                    <button className={`btn ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'} me-2`} onClick={() => handleFilterByStatus('pending')}>
                        Pending ({getStatusCount('pending')})
                    </button>
                    <button className={`btn ${filterStatus === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => handleFilterByStatus('rejected')}>
                        Rejected ({getStatusCount('rejected')})
                    </button>
                </div>

                {currentRequests.length > 0 ? (
                    <div className="row">
                        {currentRequests.map(request => (
                            <div className="col-md-6 mb-4" key={request.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5>Booking ID: {request.id}</h5>
                                        <p><strong>Venue:</strong> {request.Venue.venue_name} ({request.Venue.location})</p>
                                        <p><strong>Booking Date:</strong> {new Date(request.booking_date).toLocaleDateString()}</p>
                                        <p><strong>Start Time:</strong> {request.start_time}</p>
                                        <p><strong>End Time:</strong> {request.end_time}</p>
                                        <p><strong>Status:</strong> {request.status}</p>
                                        <button className="btn btn-success me-2" onClick={() => handleApproveReject(request, 'approved')}>
                                            Approve
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleApproveReject(request, 'rejected')}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No venue requests found.</p>
                )}

                {/* Pagination */}
                <Pagination>
                    <Pagination.Prev onClick={() => paginateRequests(currentRequestPage - 1)} disabled={currentRequestPage === 1} />
                    <Pagination.Item>{currentRequestPage}</Pagination.Item>
                    <Pagination.Next onClick={() => paginateRequests(currentRequestPage + 1)} disabled={currentRequestPage === Math.ceil(filteredRequests.length / requestItemsPerPage)} />
                </Pagination>
            </div>

            {/* Venues Section */}
            <div className="mb-4">
                <h5>Venues</h5>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by venue name or ID"
                    value={searchTerm}
                    onChange={handleVenueSearch}
                />
                {currentVenues.length > 0 ? (
                    <div className="row">
                        {currentVenues.map(venue => (
                            <div className="col-md-4 mb-4" key={venue.venue_id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5>{venue.venue_name} (ID: {venue.venue_id})</h5>
                                        <p>{venue.description}</p>
                                        <p><strong>Location:</strong> {venue.location}</p>
                                        <button className="btn btn-danger" onClick={() => handleDeleteVenue(venue.venue_id)}>
                                            Delete Venue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No venues found.</p>
                )}

                <Pagination>
                    <Pagination.Prev onClick={() => paginateVenues(currentVenuePage - 1)} disabled={currentVenuePage === 1} />
                    <Pagination.Item>{currentVenuePage}</Pagination.Item>
                    <Pagination.Next onClick={() => paginateVenues(currentVenuePage + 1)} disabled={currentVenuePage === Math.ceil(venues.length / venueItemsPerPage)} />
                </Pagination>
            </div>

            {/* Add Venue Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5>Add New Venue</h5>
                    <form onSubmit={handleAddVenue}>
                        <div className="mb-3">
                            <label>Venue Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newVenue.venue_name}
                                onChange={(e) => setNewVenue({ ...newVenue, venue_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Location</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newVenue.location}
                                onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={newVenue.description}
                                onChange={(e) => setNewVenue({ ...newVenue, description: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Venue</button>
                    </form>
                </div>
            </div>

            {/* Comment Modal */}
            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Add your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmitComment}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VenueManagementPage;
