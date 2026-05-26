import React from 'react';
import './Hero.css';
import foodImg from '../../assets/food.png';

const Hero = () => {
  return (
    <section className="hero" id="home">

      {/* Background Food Image */}
      <div className="hero__bg">
        <img src={foodImg} alt="Catering food spread" className="hero__bg-img" />
        <div className="hero__overlay"></div>
      </div>

      {/* Centered Content */}
      <div className="hero__content">

        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          Now accepting event bookings
        </div>

        <h1 className="hero__title">
          Best food for <br />
          <span className="hero__title-accent">your taste</span>
        </h1>

        <p className="hero__subtitle">
          Discover delectable cuisine and unforgettable moments —<br />
          expertly catered for weddings, parties &amp; corporate events.
        </p>

        <div className="hero__actions">
          <a href="#booking" className="hero__btn hero__btn--primary">
            🎉 Book a Catering
          </a>
          <a href="#menu" className="hero__btn hero__btn--outline">
            Explore Menu
          </a>
        </div>

       

      </div>
    </section>
  );
};

export default Hero;