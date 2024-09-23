import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../services/menuService';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState({});

  useEffect(() => {
    const fetchMenuItems = async () => {
      const data = await getMenuItems();
      setMenuItems(data);
    };
    fetchMenuItems();
  }, []);

  const handleQuantityChange = (menuItemId, quantity) => {
    setOrderItems((prev) => ({
      ...prev,
      [menuItemId]: quantity,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const items = Object.keys(orderItems).map((menuItemId) => ({
      menuItemId: parseInt(menuItemId),
      quantity: parseInt(orderItems[menuItemId]),
    }));
    try {
      await axios.post('http://localhost:2100/api/orders', { items, userId: 1 });
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <Container>
      <h1 className="text-center mb-4">Order Menu</h1>
      <Form onSubmit={handleSubmitOrder}>
        <Row>
          {menuItems.map((item) => (
            <Col key={item.id} xs={12} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>Price: ${item.price}</Card.Text>
                  <Form.Group controlId={`quantity-${item.id}`}>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={orderItems[item.id] || ''}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          Place Order
        </Button>
      </Form>
    </Container>
  );
};

export default Order;
