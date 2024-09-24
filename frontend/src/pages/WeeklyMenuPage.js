import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeeklyMenuPage = () => {
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/week`);
        setWeeklyMenu(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch weekly menu.');
        setLoading(false);
      }
    };
    fetchWeeklyMenu();
  }, []);

  if (loading) return <p>Loading weekly menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Weekly Menu</h2>
      {Object.keys(weeklyMenu).length > 0 ? (
        Object.keys(weeklyMenu).map(day => (
          <div key={day}>
            <h4>{day}</h4>
            <ul className="list-group mb-3">
              {weeklyMenu[day].map(item => (
                <li key={item.id} className="list-group-item">
                  {item.name} - ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No menu items available for the week.</p>
      )}
    </div>
  );
};

export default WeeklyMenuPage;
