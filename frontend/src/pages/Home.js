import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../services/menuService';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      const data = await getMenuItems();
      const featured = data.slice(0, 3);  // Get the first 3 items as featured (you can change this logic)
      setFeaturedItems(featured);
    };
    fetchFeaturedItems();
  }, []);

  return (
    <Container>
      <h1 className="text-center mb-4">Welcome to the Canteen</h1>
      <h2 className="text-center mb-4">Featured Menu Items</h2>
      <Row>
        {featuredItems.map((item) => (
          <Col key={item.id} xs={12} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>Price: ${item.price}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
