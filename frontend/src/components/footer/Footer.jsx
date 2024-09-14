// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white text-center py-4 mt-auto">
      <p className="font-bold">
        {currentYear} © Developed by Qintar IT Solutions
      </p>
    </footer>
  );
};

export default Footer;
