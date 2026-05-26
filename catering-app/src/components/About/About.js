import React from 'react';
import './About.css';

const offers = [
  { icon: '🌐', text: 'Easy online catering booking' },
  { icon: '🍽️', text: 'Simple food selection (Veg, Non-Veg, Sweets, and more)' },
  { icon: '💰', text: 'Transparent pricing based on number of attendees' },
  { icon: '🔐', text: 'Secure OTP-based user verification' },
  { icon: '🤝', text: 'Direct connection with catering partners' },
  { icon: '🎛️', text: 'Admin-managed quality service' },
];

const steps = [
  { number: '01', title: 'Register & Verify',       desc: 'Sign up using basic details and complete OTP verification to get started.' },
  { number: '02', title: 'Select Your Menu',         desc: 'Choose food items — Veg, Non-Veg, Sweets and more — based on your event.' },
  { number: '03', title: 'Enter Guest Count',        desc: 'Input number of attendees and the platform calculates your total cost.' },
  { number: '04', title: 'Submit Order',             desc: 'Review everything and submit your order with a single click.' },
  { number: '05', title: 'Partner Assigned',         desc: 'Our admin reviews and assigns the most suitable catering partner for you.' },
  { number: '06', title: 'Connect Directly',         desc: 'Receive your partner\'s details and get in touch to finalise the event.' },
];

const reasons = [
  { icon: '✨', title: 'Simple Interface',     desc: 'Designed to be intuitive — anyone can book without technical knowledge.' },
  { icon: '⚡', title: 'Fast Booking',         desc: 'From registration to order confirmation in just a few minutes.' },
  { icon: '🏅', title: 'Trusted Partners',     desc: 'Every catering partner on our platform is verified and reliable.' },
  { icon: '🎉', title: 'All Event Types',      desc: 'Weddings, parties, corporate functions — we handle catering for all.' },
];

const About = () => {
  return (
    <section className="about" id="about">

      {/* ── HERO ── */}
      <div className="about__hero">
        <div className="about__hero-orb about__hero-orb--1" />
        <div className="about__hero-orb about__hero-orb--2" />
        <div className="about__hero-inner">
          <span className="about__eyebrow">About Us</span>
          <h2 className="about__hero-title">
            Welcome to <span className="about__hero-accent">Event Catering Solutions</span>
          </h2>
          <p className="about__hero-desc">
            A smart and simple catering booking platform designed to make event food
            planning <strong>effortless</strong>. We understand how challenging it can be
            to arrange quality food for weddings, parties, and corporate functions —
            so we connect you directly with trusted catering partners through an
            easy-to-use online platform.
          </p>
        </div>
      </div>

      {/* ── MISSION ── */}
      <div className="about__mission-wrap">
        <div className="about__mission-inner">
          <div className="about__mission-text-block">
            <span className="about__eyebrow about__eyebrow--red">Our Mission</span>
            <h3 className="about__section-title">
              Seamless catering,<br />
              <span className="about__title-italic">zero hassle.</span>
            </h3>
            <p className="about__body-text">
              Our mission is to provide a seamless and reliable way for users to book
              catering services without hassle. We aim to save time, reduce stress, and
              ensure every event is served with quality food and professional service.
            </p>
          </div>
          <div className="about__mission-visual">
            <div className="about__mission-badge">
              <span className="about__mission-badge-icon">🎯</span>
              <p className="about__mission-badge-text">
                "Simplifying event food planning for everyone."
              </p>
            </div>
            <div className="about__mission-tags">
              {['Weddings', 'Parties', 'Corporate Events', 'Functions'].map(t => (
                <span className="about__tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHAT WE OFFER ── */}
      <div className="about__offer-section">
        <div className="about__section-header">
          <span className="about__eyebrow about__eyebrow--red">What We Offer</span>
          <h3 className="about__section-title">Everything you need, in one place</h3>
        </div>
        <div className="about__offer-grid">
          {offers.map((o, i) => (
            <div
              className="about__offer-card"
              key={i}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="about__offer-icon">{o.icon}</span>
              <p className="about__offer-text">{o.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="about__steps-section">
        <div className="about__section-header">
          <span className="about__eyebrow about__eyebrow--light">How It Works</span>
          <h3 className="about__section-title about__section-title--light">
            Six steps to a perfect event
          </h3>
          <p className="about__section-sub about__section-sub--light">
            From sign-up to the last plate — the whole journey in minutes.
          </p>
        </div>
        <div className="about__steps-grid">
          {steps.map((step, i) => (
            <div
              className="about__step-card"
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="about__step-number">{step.number}</div>
              <h4 className="about__step-title">{step.title}</h4>
              <p className="about__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div className="about__why-section">
        <div className="about__section-header">
          <span className="about__eyebrow about__eyebrow--red">Why Choose Us</span>
          <h3 className="about__section-title">Built for trust &amp; simplicity</h3>
        </div>
        <div className="about__why-grid">
          {reasons.map((r, i) => (
            <div
              className="about__why-card"
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="about__why-icon-wrap">
                <span className="about__why-icon">{r.icon}</span>
              </div>
              <h4 className="about__why-title">{r.title}</h4>
              <p className="about__why-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── VISION BANNER ── */}
      <div className="about__vision-banner">
        <div className="about__vision-orb" />
        <span className="about__eyebrow about__eyebrow--light">Our Vision</span>
        <h3 className="about__vision-title">
          Becoming the leading platform<br />for catering services.
        </h3>
        <p className="about__vision-desc">
          We aim to combine technology with quality food service, making event planning
          easier for everyone — everywhere.
        </p>
      </div>

    </section>
  );
};

export default About;