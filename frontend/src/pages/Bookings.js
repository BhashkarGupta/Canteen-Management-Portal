import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Bookings = () => {
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [venue, setVenue] = useState('Conference Room A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:2100/api/bookings', {
        bookingDate,
        bookingTime,
        reservationStart: `${bookingDate}T${bookingTime}:00`,
        reservationEnd: `${bookingDate}T${parseInt(bookingTime) + 1}:00`,  // 1 hour duration
        purpose,
        venue,
        userId: 1,  // Update with real user data
      });
      alert('Booking successful!');
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1 className="text-center">Book a Venue</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="venue">
              <Form.Label>Select Venue</Form.Label>
              <Form.Control as="select" value={venue} onChange={(e) => setVenue(e.target.value)}>
                <option>Conference Room A</option>
                <option>Conference Room B</option>
                <option>Table 1</option>
                <option>Table 2</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="bookingDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="bookingTime">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="purpose">
              <Form.Label>Purpose</Form.Label>
              <Form.Control type="text" placeholder="Enter purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Book Now
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Bookings;
