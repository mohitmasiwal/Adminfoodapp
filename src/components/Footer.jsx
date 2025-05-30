 import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ padding: "20px", textAlign: "center", background: "#f5f5f5", marginTop: "40px" }}>
      <p><strong>FoodieZone</strong> &copy; {currentYear}</p>
      <p>Contact: support@foodiezone.com</p>
      <p>
        <Link to="/user" style={{ textDecoration: "none", color: "blue" }}>User</Link>
      </p>
    </footer>
  );
};

export default Footer;
