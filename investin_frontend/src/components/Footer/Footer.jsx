import React from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import logo from '../../assets/biglogo.png'; // Adjust path as needed

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Company Logo" className="w-32" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Contact Information */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">Investin</h2>
            <p className="mb-4">E-404 Status Complex, Vadodara, Gujarat,390025</p>
            <p className="mb-4">
              <a href="mailto:210303105289@paruluniversity.ac.in" className="hover:underline">
                info@investin.com
              </a>
            </p>
            <p className="mb-4">
              <a href="tel:+1234567890" className="hover:underline">
                +91 7126277777
              </a>
            </p>
          </div>

          {/* Social Media Links */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://twitter.com" className="hover:text-gray-400">
                <FaTwitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://facebook.com" className="hover:text-gray-400">
                <FaFacebookF size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://linkedin.com" className="hover:text-gray-400">
                <FaLinkedinIn size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://instagram.com" className="hover:text-gray-400">
                <FaInstagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} Investin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
