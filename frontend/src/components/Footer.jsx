import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Bots Planet</h3>
        <p>Your one-stop platform to create, manage, and grow your Sales Bots efficiently!</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Bots Planet | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
