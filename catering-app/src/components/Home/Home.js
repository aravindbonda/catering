import React from 'react';
import './Home.css';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
import Food from '../Food/Food';
import Footer from '../Footer/Footer';

const stats = [
  { number: '500+', label: 'Events Catered' },
  { number: '50+',  label: 'Menu Items' },
  { number: '4.9★', label: 'Average Rating' },
  { number: '24/7', label: 'Support' },
];

const features = [
  {
    icon: '🛡️',
    title: 'Hygiene Certified',
    desc: 'All our kitchens maintain the highest food safety standards.',
  },
  {
    icon: '⚡',
    title: 'Quick Booking',
    desc: 'Book a complete catering package in under 5 minutes.',
  },
  {
    icon: '🤝',
    title: 'Trusted Partners',
    desc: 'We connect you with vetted, experienced catering professionals.',
  },
  {
    icon: '🎉',
    title: 'Any Occasion',
    desc: 'Weddings, birthdays, corporates — we handle them all.',
  },
];

const Home = () => {
  return (
    <div className="home">

      {/* Header / Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Stats Strip */}
      <section className="home__stats">
        <div className="home__stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="home__stat">
              <span className="home__stat-number">{s.number}</span>
              <span className="home__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Food Menu Section */}
      <Food />

      {/* Features / Why Us */}
      <section className="home__features">
        <div className="home__features-container">
          <div className="home__features-header">
            <span className="home__eyebrow">Why CaterBliss</span>
            <h2 className="home__features-title">
              Everything you need,<br />
              <span className="home__features-accent">perfectly delivered</span>
            </h2>
          </div>
          <div className="home__features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="home__feature-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="home__feature-icon">{f.icon}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home__cta">
        <div className="home__cta-inner">
          <h2 className="home__cta-title">Ready to make your event unforgettable?</h2>
          <p className="home__cta-sub">Get a free quote in minutes. No commitment required.</p>
          <a href="#booking" className="home__cta-btn">
            Start Booking Now →
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;