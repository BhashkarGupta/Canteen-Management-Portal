import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentDots, FaComments } from 'react-icons/fa'; // Icons for feedback

const FeedbackPage = () => {
  const [feedbackContent, setFeedbackContent] = useState(''); // For general feedback
  const [venueFeedbackContent, setVenueFeedbackContent] = useState(''); // For venue feedback
  const [venues, setVenues] = useState([]); // Available venues
  const [selectedVenue, setSelectedVenue] = useState(''); // Selected venue for feedback
  const [message, setMessage] = useState(''); // Success message
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch available venues for the dropdown
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/venues`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  // Submit general feedback
  const handleGeneralFeedbackSubmit = async () => {
    if (!feedbackContent) {
      setErrorMessage('Please provide some feedback');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/feedback`, { content: feedbackContent });
      setMessage('Thank you for your feedback!');
      setFeedbackContent(''); // Reset feedback content
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage('Failed to submit feedback. Please try again.');
    }
  };

  // Submit venue-specific feedback
  const handleVenueFeedbackSubmit = async () => {
    if (!selectedVenue || !venueFeedbackContent) {
      setErrorMessage('Please select a venue and provide feedback');
      return;
    }

    try {
      const venueFeedback = {
        venue_id: selectedVenue,
        content: venueFeedbackContent,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/venue-feedback`, venueFeedback);
      setMessage('Thank you for your venue feedback!');
      setVenueFeedbackContent('');
      setSelectedVenue('');
    } catch (error) {
      console.error('Error submitting venue feedback:', error);
      setErrorMessage('Failed to submit venue feedback. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">
        <FaCommentDots className="me-2" /> Suggestion and Feedback
      </h3>

      {/* Display success or error message */}
      {message && <div className="alert alert-success">{message}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* General Feedback Form */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>Submit General Feedback</h5>
        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Provide your feedback or suggestion..."
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleGeneralFeedbackSubmit}>
          Submit Feedback
        </button>
      </div>

      {/* Venue Feedback Form */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>Submit Venue Feedback</h5>
        <div className="row mb-3">
          <div className="col-md-6">
            <select
              className="form-control"
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
            >
              <option value="">Select a Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.venue_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Provide your feedback for the selected venue..."
          value={venueFeedbackContent}
          onChange={(e) => setVenueFeedbackContent(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleVenueFeedbackSubmit}>
          Submit Venue Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
