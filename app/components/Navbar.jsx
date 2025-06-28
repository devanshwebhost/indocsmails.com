'use client';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-2"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`position-fixed top-0 start-0 h-100 bg-primary text-white px-4 py-4 z-3`}
        style={{
          width: '250px',
          transition: '0.3s',
          left: sidebarOpen ? '0' : '-260px',
        }}
      >
        <h5 className="mb-4">Indocs Mails</h5>
        <a href="#" className="d-block text-white mb-3 text-decoration-none">Home</a>
        <a href="#" className="d-block text-white mb-3 text-decoration-none">Features</a>
        <a href="#" className="d-block text-white mb-3 text-decoration-none">Pricing</a>
        <a href="#" className="d-block text-white mb-3 text-decoration-none">Contact</a>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-3">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img
            src="https://indocsmedia.onrender.com/assets/images/logo-1.jfif"
            alt="Logo"
            style={{ height: '40px', borderRadius: '5px' }}
          />
          <span className="fw-bold text-primary">Indocs Mails</span>
        </a>

        <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex">
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link text-dark" href="#">Home</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="#">Features</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="#">Pricing</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="#">Contact</a></li>
          </ul>
        </div>
      </nav>
    </>
  );
}
