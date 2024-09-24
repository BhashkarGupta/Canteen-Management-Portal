import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [todayMenu, setTodayMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/today`);
        setTodayMenu(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch today\'s menu.');
        setLoading(false);
      }
    };
    fetchTodayMenu();
  }, []);

  if (loading) return <p>Loading today\'s menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Today's Menu</h2>
      <div className="row">
        {todayMenu.length > 0 ? (
          todayMenu.map(item => (
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
          <p>No menu items available for today.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
