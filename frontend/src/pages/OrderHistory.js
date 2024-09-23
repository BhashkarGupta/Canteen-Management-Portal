import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:2100/api/orders/user/1'); // Check userId and endpoint
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };
    fetchOrderHistory();
  }, []);

  return (
    <Container>
      <h1 className="text-center mb-4">Order History</h1>
      <Row>
        {orders.map((order) => (
          <Col key={order.id} xs={12} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Order ID: {order.id}</Card.Title>
                <Card.Text>Total Cost: ${order.totalCost}</Card.Text>
                <Card.Text>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Card.Text>
                <Card.Text>
                  Items:
                  <ul>
                    {order.OrderItems.map((item) => (
                      <li key={item.id}>
                        {item.MenuItem.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OrderHistory
