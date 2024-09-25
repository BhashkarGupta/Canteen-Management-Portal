import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-5 py-3 bg-dark text-white text-center">
      <div className="container">
        <span>&copy; {new Date().getFullYear()} Canteen Management Portal</span>
      </div>
    </footer>
  );
};

export default Footer;

