import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../services/menuService';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const data = await getMenuItems();
      setMenuItems(data);
    };
    fetchMenuItems();
  }, []);

  return (
    <Container>
      <h1 className="text-center mb-4">Menu</h1>
      <Row>
        {menuItems.map((item) => (
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

export default Menu;
