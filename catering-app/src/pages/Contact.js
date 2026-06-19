function Contact() {
  return (
    <section className="section-wrap" id="contact">
      <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe">
        <div className="relative z-10">
          <p className="font-bold uppercase text-[#D9B08C]">Contact</p>
          <h1 className="mt-2 text-4xl font-extrabold">Catering Connect Support</h1>
          <p className="mt-3 max-w-2xl text-white/75">Questions about bookings, partner approval, payments, or tracking can be sent to the operations team.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="panel-card"><p className="eyebrow">Email</p><h2 className="mt-2 text-xl font-extrabold">support@caterbliss.local</h2></div>
        <div className="panel-card"><p className="eyebrow">Phone</p><h2 className="mt-2 text-xl font-extrabold">+91 99999 99999</h2></div>
        <div className="panel-card"><p className="eyebrow">Office</p><h2 className="mt-2 text-xl font-extrabold">Hyderabad Operations Desk</h2></div>
      </div>
    </section>
  );
}

export default Contact;
