import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu`);
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch menu items.');
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Today's Menu</h2>
      <div className="row">
        {menuItems.length > 0 ? (
          menuItems.map(item => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  <p><strong>Status:</strong> {item.availability}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
