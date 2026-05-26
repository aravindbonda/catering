import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="contact" className="border-t border-[#E9E9EB] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-stone-600 sm:px-6 md:grid-cols-[1.25fr_0.7fr_0.7fr_1fr] lg:px-8">
        <div>
          <Link className="flex items-center gap-3 text-xl font-extrabold text-[#282C3F]" to="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-saffron-600 to-orange-400 text-sm text-white shadow-lg shadow-orange-100">CB</span>
            CaterBliss
          </Link>
          <p className="mt-4 max-w-sm leading-7">
            AI-powered B2B catering marketplace for local and outstation events, verified vendors, menu extraction, route logistics, and quote comparison.
          </p>
        </div>
        <div>
          <strong className="text-stone-950">Platform</strong>
          <div className="mt-3 grid gap-2">
            <a className="hover:text-saffron-700" href="/#services">Services</a>
            <a className="hover:text-saffron-700" href="/#vendors">Vendors</a>
            <Link className="hover:text-saffron-700" to="/menu">Upload menu</Link>
            <Link className="hover:text-saffron-700" to="/register-partner">Vendor signup</Link>
          </div>
        </div>
        <div>
          <strong className="text-stone-950">Support</strong>
          <div className="mt-3 grid gap-2">
            <span>Email verification</span>
            <span>Quote comparison</span>
            <span>Event planning</span>
            <span>Booking support</span>
          </div>
        </div>
        <div>
          <strong className="text-stone-950">Newsletter</strong>
          <p className="mt-3 leading-6">Get product updates, vendor onboarding notes, and event planning insights.</p>
          <form className="mt-4 flex gap-2">
            <input className="input-field min-w-0 flex-1" type="email" placeholder="Email address" aria-label="Email address" />
            <button className="btn-primary px-4" type="button">Join</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Instagram', 'Facebook', 'LinkedIn'].map((item) => (
              <a className="rounded-2xl border border-stone-200 px-3 py-2 font-bold text-stone-700 transition hover:border-saffron-500 hover:text-saffron-700" href="#contact" key={item}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-orange-100 px-4 py-4 text-center text-xs font-semibold text-stone-500">
        Copyright 2026 CaterBliss. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
