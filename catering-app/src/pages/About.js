const steps = [
  ['01', 'Register and verify', 'Customers and partners complete secure email OTP verification before using the platform.'],
  ['02', 'Customize menu', 'Build a catering plate across veg, non-veg, starters, desserts, and special instructions.'],
  ['03', 'Transparent pricing', 'Guest count and item selections create a live total before the order is submitted.'],
  ['04', 'Admin assignment', 'Admin reviews the booking and assigns an approved catering partner for the location.'],
  ['05', 'Partner execution', 'Partner accepts the order, updates status, and completes the event service.'],
  ['06', 'Reviews and earnings', 'Users can review the partner while earnings and payments stay visible in dashboards.']
];

const quality = [
  'Pending approval status for every new partner',
  'Approval, rejection, suspension, and assignment controls for admins',
  'Notifications for registrations, new orders, order updates, and payments',
  'Dashboard analytics for users, partners, orders, revenue, reviews, and activity'
];

function About() {
  return (
    <section className="section-wrap">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">About CaterBliss</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#1F1F1F] md:text-5xl">
            Catering management built for customers, admins, and service partners
          </h1>
        </div>
        <div className="panel-card p-6 md:p-8">
          <p className="text-lg leading-8 text-[#755F54]">
            CaterBliss turns event food planning into a simple digital workflow: customers register, verify OTP, choose menu items, calculate pricing, place orders, and receive a verified catering partner assigned by the admin.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(([number, title, desc]) => (
          <article className="luxe-card p-5" key={number}>
            <span className="text-3xl font-extrabold text-[#7A2E1F]">{number}</span>
            <h3 className="mt-4 text-xl font-extrabold text-[#1F1F1F]">{title}</h3>
            <p className="mt-3 leading-7 text-[#755F54]">{desc}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe md:p-10">
          <div className="relative z-10">
          <p className="font-bold uppercase tracking-[0.16em] text-[#D9B08C]">Quality system</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Admin-managed trust for every event</h2>
          <p className="mt-4 leading-8 text-white/75">
            The platform keeps partner access gated until approval, gives admins order assignment controls, and lets partners manage operations from a dedicated catering dashboard.
          </p>
          </div>
        </div>

        <div className="panel-card">
          <h3 className="text-2xl font-extrabold text-[#1F1F1F]">What the system covers</h3>
          <div className="mt-5 grid gap-3">
            {quality.map((item) => (
              <div className="rounded-2xl border border-[#EADCCB] bg-[#FFF7EF] p-4 text-sm font-bold leading-6 text-[#1F1F1F]" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
