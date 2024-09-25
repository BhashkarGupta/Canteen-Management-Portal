import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdFastfood } from 'react-icons/md'; // Food icon

const WeeklyMenuPage = () => {
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch weekly menu
    const fetchWeeklyMenu = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/week`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWeeklyMenu(response.data); // Set the menu object
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch weekly menu.');
        setLoading(false);
        console.log(error);
      }
    };

    fetchWeeklyMenu();
  }, []);

  if (loading) return <p>Loading weekly menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">
        <MdFastfood size={30} className="me-2" /> Weekly Menu
      </h3>

      {Object.keys(weeklyMenu).length > 0 ? (
        <div className="row">
          {Object.keys(weeklyMenu).map((day, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{day}</h5>
                  <ul className="list-group">
                    {weeklyMenu[day].map(menuItem => (
                      <li key={menuItem.id} className="list-group-item">
                        {menuItem.name} - ₹{menuItem.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No weekly menu available at the moment.</p>
      )}
    </div>
  );
};

export default WeeklyMenuPage;
