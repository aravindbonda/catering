import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home',  path: '/'      },
    { label: 'About', path: '/about' },
    { label: 'Menu',  path: '/menu'  },
  ];

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>

      {/* Top Info Bar */}
      <div className="header__topbar">
        <div className="header__topbar-inner">
          <div className="header__contact-info">
            <span className="header__contact-item">
              <span className="header__icon">📞</span>
              (414) 857 – 0107
            </span>
            <span className="header__divider">|</span>
            <span className="header__contact-item">
              <span className="header__icon">✉</span>
              yummy@caterbliss.com
            </span>
          </div>
          <div className="header__socials">
            <a href="#" className="header__social-link" aria-label="Twitter">𝕏</a>
            <a href="#" className="header__social-link" aria-label="Facebook">f</a>
            <a href="#" className="header__social-link" aria-label="Instagram">◎</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="header__nav">
        <div className="header__nav-inner">

          {/* Logo */}
          <Link to="/" className="header__logo">
            <div className="header__logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4C11.16 4 4 11.16 4 20s7.16 16 16 16 16-7.16 16-16S28.84 4 20 4z" fill="#FC8019" opacity="0.1"/>
                <path d="M14 16c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="#FC8019" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 10v4M12 28c1-3 4-5 8-5s7 2 8 5" stroke="#FC8019" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="20" cy="22" r="3" fill="#FC8019"/>
              </svg>
            </div>
            <span className="header__logo-text">CaterBliss</span>
          </Link>

          {/* Nav Links */}
          <ul className={`header__links ${menuOpen ? 'header__links--open' : ''}`}>
            {navLinks.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <li key={label}>
                  <Link
                    to={path}
                    className={`header__link ${isActive ? 'header__link--active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sign In + Hamburger */}
          <div className="header__actions">
            <Link to="/signin" className="header__signin-btn">Sign In</Link>
            <button
              className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
};

export default Header;
