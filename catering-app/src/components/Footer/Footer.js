import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Company: ['About Us', 'Our Story', 'Careers', 'Press'],
    Services: ['Wedding Catering', 'Corporate Events', 'Birthday Parties', 'Private Dining'],
    Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
  };

  return (
    <footer className="footer">
      {/* Decorative wave top */}
      <div className="footer__wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#282C3F"/>
        </svg>
      </div>

      <div className="footer__body">
        <div className="footer__container">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                <path d="M14 16c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="#FC8019" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 10v4M12 28c1-3 4-5 8-5s7 2 8 5" stroke="#FC8019" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="20" cy="22" r="3" fill="#FC8019"/>
              </svg>
              <span>CaterBliss</span>
            </div>
            <p className="footer__tagline">
              Bringing extraordinary culinary experiences to life — one event at a time.
            </p>
            <div className="footer__socials">
              {['𝕏', 'f', '◎', 'in'].map((s, i) => (
                <a key={i} href="#" className="footer__social">{s}</a>
              ))}
            </div>
            <div className="footer__contact-block">
              <div className="footer__contact-row">
                <span className="footer__contact-icon">📞</span>
                <span>(414) 857 – 0107</span>
              </div>
              <div className="footer__contact-row">
                <span className="footer__contact-icon">✉</span>
                <span>yummy@caterbliss.com</span>
              </div>
              <div className="footer__contact-row">
                <span className="footer__contact-icon">📍</span>
                <span>Nellore, Andhra Pradesh</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="footer__col">
              <h4 className="footer__col-heading">{heading}</h4>
              <ul className="footer__col-list">
                {items.map(item => (
                  <li key={item}>
                   <Link to="/about" className="footer__col-link">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="footer__newsletter">
            <h4 className="footer__col-heading">Stay in the loop</h4>
            <p className="footer__newsletter-text">
              Get exclusive menus, seasonal offers, and event inspiration delivered to your inbox.
            </p>
            <div className="footer__newsletter-form">
              <input
                type="email"
                placeholder="your@email.com"
                className="footer__newsletter-input"
              />
              <button className="footer__newsletter-btn">→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span>© {year} CaterBliss. All rights reserved.</span>
          <span className="footer__bottom-love">Made with ❤️ for every celebration</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
