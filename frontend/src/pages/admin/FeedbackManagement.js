import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Pagination } from 'react-bootstrap';
import { format } from 'date-fns';

const FeedbackManagementPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [venueFeedbacks, setVenueFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [filteredVenueFeedbacks, setFilteredVenueFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [venueSearchTerm, setVenueSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // Fetch feedbacks and venue feedbacks on load
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const feedbackResponse = await axios.get(`${process.env.REACT_APP_API_URL}/feedback`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const venueFeedbackResponse = await axios.get(`${process.env.REACT_APP_API_URL}/venue-feedback`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                setFeedbacks(feedbackResponse.data);
                setFilteredFeedbacks(feedbackResponse.data);
                setVenueFeedbacks(venueFeedbackResponse.data);
                setFilteredVenueFeedbacks(venueFeedbackResponse.data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    // Handle feedback search by user name or email
    const handleFeedbackSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const searched = feedbacks.filter(
            (feedback) =>
                feedback.user.name.toLowerCase().includes(term) ||
                feedback.user.email.toLowerCase().includes(term)
        );
        setFilteredFeedbacks(searched);
    };

    // Handle venue feedback search by venue name or user name/email
    const handleVenueFeedbackSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setVenueSearchTerm(term);
        const searched = venueFeedbacks.filter(
            (feedback) =>
                feedback.venue.venue_name.toLowerCase().includes(term) ||
                feedback.user.name.toLowerCase().includes(term) ||
                feedback.user.email.toLowerCase().includes(term)
        );
        setFilteredVenueFeedbacks(searched);
    };

    // Handle date filter for feedbacks
    const handleFeedbackFilterByDate = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const filtered = feedbacks.filter((feedback) => {
            const feedbackDate = new Date(feedback.createdAt);
            return feedbackDate >= start && feedbackDate <= end;
        });
        setFilteredFeedbacks(filtered);
    };

    // Handle date filter for venue feedbacks
    const handleVenueFeedbackFilterByDate = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const filtered = venueFeedbacks.filter((feedback) => {
            const feedbackDate = new Date(feedback.createdAt);
            return feedbackDate >= start && feedbackDate <= end;
        });
        setFilteredVenueFeedbacks(filtered);
    };

    // Reset filters
    const handleResetFilter = () => {
        setSearchTerm('');
        setVenueSearchTerm('');
        setFilteredFeedbacks(feedbacks);
        setFilteredVenueFeedbacks(venueFeedbacks);
    };

    // Handle venue feedback deletion
    const handleDeleteVenueFeedback = async (feedbackId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/venue-feedback/${feedbackId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setFilteredVenueFeedbacks(filteredVenueFeedbacks.filter((feedback) => feedback.id !== feedbackId));
        } catch (error) {
            console.error('Error deleting venue feedback:', error);
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
    const currentVenueFeedbacks = filteredVenueFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Feedback Management</h3>

            {/* General Feedback Management */}
            <div className="mb-5">
                <Card className="shadow-sm p-4">
                    <h5>General Feedback</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Search by User Name or Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={handleFeedbackSearch}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Filter by Date</Form.Label>
                        <div className="row g-2">
                            <div className="col-md-4">
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2 d-grid">
                                <Button className="btn-sm" onClick={handleFeedbackFilterByDate}>
                                    Apply Filter
                                </Button>
                            </div>
                            <div className="col-md-2 d-grid">
                                <Button className="btn-sm" variant="secondary" onClick={handleResetFilter}>
                                    Clear Filter
                                </Button>
                            </div>
                        </div>
                    </Form.Group>


                    <div className="row">
                        {currentFeedbacks.map((feedback) => (
                            <div className="col-md-4 mb-4" key={feedback.feedback_id}>
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <Card.Title>{feedback.user.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {feedback.user.email}
                                        </Card.Subtitle>
                                        <Card.Text>{feedback.content}</Card.Text>
                                        <Card.Footer className="text-muted">
                                            {format(new Date(feedback.createdAt), 'yyyy-MM-dd')}
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <Pagination>
                        {/* Pagination logic */}
                        {Array.from({ length: Math.ceil(filteredFeedbacks.length / itemsPerPage) }).map(
                            (_, i) => (
                                <Pagination.Item key={i + 1} onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </Pagination.Item>
                            )
                        )}
                    </Pagination>
                </Card>
            </div>

            {/* Venue Feedback Management */}
            <div className="mb-5">
                <Card className="shadow-sm p-4">
                    <h5>Venue Feedback</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Search by Venue Name, User Name, or Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search venue feedback..."
                            value={venueSearchTerm}
                            onChange={handleVenueFeedbackSearch}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Filter by Date</Form.Label>
                        <div className="row g-2">
                            <div className="col-md-4">
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2 d-grid">
                                <Button className="btn-sm" onClick={handleVenueFeedbackFilterByDate}>
                                    Apply Filter
                                </Button>
                            </div>
                            <div className="col-md-2 d-grid">
                                <Button className="btn-sm" variant="secondary" onClick={handleResetFilter}>
                                    Clear Filter
                                </Button>
                            </div>
                        </div>
                    </Form.Group>


                    <div className="row">
                        {currentVenueFeedbacks.map((feedback) => (
                            <div className="col-md-4 mb-4" key={feedback.id}>
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <Card.Title>{feedback.venue.venue_name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {feedback.user.name} - {feedback.user.email}
                                        </Card.Subtitle>
                                        <Card.Text>{feedback.content}</Card.Text>
                                        <Card.Footer className="text-muted">
                                            {format(new Date(feedback.createdAt), 'yyyy-MM-dd')}
                                        </Card.Footer>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteVenueFeedback(feedback.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <Pagination>
                        {/* Pagination logic */}
                        {Array.from({ length: Math.ceil(filteredVenueFeedbacks.length / itemsPerPage) }).map(
                            (_, i) => (
                                <Pagination.Item key={i + 1} onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </Pagination.Item>
                            )
                        )}
                    </Pagination>
                </Card>
            </div>
        </div>
    );
};

export default FeedbackManagementPage;
