import React, { useState, useEffect } from 'react';
import './Navbar.css';
// Corrected path: since it's in the same folder as Navbar.jsx
import logo from './VJTI_Logo.jpg';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Achievements', icon: 'fa-trophy' },
    { id: 'submit', label: 'Submit', icon: 'fa-plus-circle' },
    { id: 'admin', label: 'Admin Panel', icon: 'fa-shield-halved' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* Left: Logo & Brand */}
        <div className="navbar__brand" onClick={() => setCurrentPage('home')}>
          <div className="navbar__logo-wrap">
            <img
              src={logo} /* Corrected: no quotes, use the variable */
              alt="VJTI Logo"
              className="navbar__logo-img"
            />
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__name">VJTI Mumbai</span>
            <span className="navbar__tagline">Veermata Jijabai Technological Institute</span>
          </div>
        </div>

        {/* Center: Nav Links */}
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`navbar__link ${currentPage === item.id ? 'navbar__link--active' : ''}`}
                onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
              >
                <i className={`fas ${item.icon}`}></i>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar__spacer"></div>

        {/* Mobile hamburger */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Red bottom bar accent */}
      <div className="navbar__bar"></div>
    </nav>
  );
};

export default Navbar;