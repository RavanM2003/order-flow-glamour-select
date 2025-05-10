
import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-glamour-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl text-glamour-800 mb-4">Glamour Studio</h3>
            <p className="text-gray-600">
              Providing premium beauty services since 2020. We're dedicated to enhancing your 
              natural beauty and building your confidence.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-glamour-800 mb-4">Contact Us</h3>
            <address className="text-gray-600 not-italic">
              <p>123 Beauty Street</p>
              <p>Baku, Azerbaijan</p>
              <p className="mt-2">Email: info@glamourstudio.az</p>
              <p>Phone: +994 50 123 4567</p>
            </address>
          </div>
          <div>
            <h3 className="font-bold text-glamour-800 mb-4">Hours</h3>
            <ul className="text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 Glamour Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
