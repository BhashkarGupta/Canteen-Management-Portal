import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaCalendarAlt, FaBuilding } from 'react-icons/fa'; // Icons
import { format } from 'date-fns'; // Date formatting

const VenueBookingPage = () => {
  const [venues, setVenues] = useState([]); // Available venues
  const [myBookings, setMyBookings] = useState([]); // User's bookings
  const [selectedVenue, setSelectedVenue] = useState(null); // Venue to book
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // For searching bookings
  const [startDate, setStartDate] = useState(''); // Filter start date
  const [endDate, setEndDate] = useState(''); // Filter end date
  const [filteredBookings, setFilteredBookings] = useState([]); // Filtered bookings

  // Fetch all available venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/venues`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    const fetchMyBookings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/venue-bookings/my-bookings`);
        setMyBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchVenues();
    fetchMyBookings();
  }, []);

  // Handle venue booking submission
  const handleBookingSubmit = async () => {
    if (!selectedVenue || !bookingDate || !startTime || !endTime || !purpose) {
      alert('Please fill all the fields');
      return;
    }

    try {
      const bookingData = {
        venue_id: selectedVenue.id,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        purpose,
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/venue-bookings`, bookingData);
      alert('Venue booked successfully!');
      setSelectedVenue(null);
      setBookingDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
    } catch (error) {
      console.error('Error booking venue:', error);
      alert('Failed to book the venue. Please try again.');
    }
  };

  // Search bookings by purpose or venue name
  const handleSearch = () => {
    if (searchTerm === '') {
      setFilteredBookings(myBookings); // Reset if search term is empty
      return;
    }

    const searched = myBookings.filter((booking) =>
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.Venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBookings(searched);
  };

  // Filter bookings by date range
  const handleFilterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredBookings(myBookings); // Reset if date filters are empty
      return;
    }

    const filtered = myBookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
    });

    setFilteredBookings(filtered);
  };

  // Reset filters and search
  const handleResetFilter = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setFilteredBookings(myBookings);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">
        <FaBuilding className="me-2" /> Venue Bookings
      </h3>

      {/* Booking Form */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>Book a Venue</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Select Venue</label>
            <select
              className="form-control"
              value={selectedVenue?.id || ''}
              onChange={(e) => setSelectedVenue(venues.find((v) => v.id === parseInt(e.target.value)))}
            >
              <option value="">Choose a Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.venue_name} - {venue.location}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Booking Date</label>
            <input
              type="date"
              className="form-control"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Start Time</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>End Time</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="col-md-12 mb-3">
            <label>Purpose</label>
            <textarea
              className="form-control"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Enter purpose of booking"
            />
          </div>
          <div className="col-md-12">
            <button className="btn btn-primary" onClick={handleBookingSubmit}>
              Book Venue
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>
          <FaSearch className="me-2" /> Search My Bookings
        </h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              placeholder="Search by purpose or venue name"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <button className="btn btn-primary me-2" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>
          <FaFilter className="me-2" /> Filter by Date
        </h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-12">
            <button className="btn btn-primary me-2" onClick={handleFilterByDate}>
              Filter
            </button>
            <button className="btn btn-secondary" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* User's Venue Bookings */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Booking Date</th>
              <th>Time</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Admin Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.Venue.venue_name}</td>
                <td>{format(new Date(booking.booking_date), 'yyyy-MM-dd')}</td>
                <td>
                  {booking.start_time} - {booking.end_time}
                </td>
                <td>{booking.purpose}</td>
                <td>{booking.status}</td>
                <td>{booking.admin_comment || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default VenueBookingPage;
