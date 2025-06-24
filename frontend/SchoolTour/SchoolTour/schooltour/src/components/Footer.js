import React from 'react';
import '../css/footer.css'; // Optional for styling

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
