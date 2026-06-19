import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-bold transition ${
      isActive ? 'bg-white/95 text-[#7A2E1F] shadow-sm' : 'text-white/82 hover:bg-white/12 hover:text-white'
    }`;

  const closeMenus = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'partner' ? '/partner' : '/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#4B1D14]/88 shadow-lg shadow-[#2B110C]/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 text-xl font-extrabold text-white" to="/" onClick={closeMenus}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#FC8019] to-[#D9B08C] text-sm font-extrabold text-white shadow-lg shadow-black/20">
            CB
          </span>
          <span>CaterBliss</span>
        </Link>

        <button
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-xl font-black text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
          aria-label="Toggle navigation"
        >
          {open ? 'X' : '='}
        </button>

        <div className={`${open ? 'flex' : 'hidden'} absolute left-4 right-4 top-[72px] flex-col gap-3 rounded-[1.5rem] border border-[#EADCCB] bg-[#4B1D14] p-4 shadow-luxe md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <nav className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <NavLink className={navClass} to="/" onClick={closeMenus}>Home</NavLink>
            <NavLink className={navClass} to="/book" onClick={closeMenus}>Book</NavLink>
            <NavLink className={navClass} to="/orders" onClick={closeMenus}>Orders</NavLink>
            <a className="rounded-full px-4 py-2 text-sm font-bold text-white/82 transition hover:bg-white/12 hover:text-white" href="/#services" onClick={() => setOpen(false)}>Services</a>
            <a className="rounded-full px-4 py-2 text-sm font-bold text-white/82 transition hover:bg-white/12 hover:text-white" href="/#vendors" onClick={() => setOpen(false)}>Vendors</a>
            <a className="rounded-full px-4 py-2 text-sm font-bold text-white/82 transition hover:bg-white/12 hover:text-white" href="/#about" onClick={() => setOpen(false)}>About</a>
            <NavLink className={navClass} to="/contact" onClick={closeMenus}>Contact</NavLink>
            {user?.role === 'admin' && <NavLink className={navClass} to="/admin" onClick={closeMenus}>Admin</NavLink>}
            {user?.role === 'partner' && <NavLink className={navClass} to="/partner" onClick={closeMenus}>Partner</NavLink>}
          </nav>

          {!user ? (
            <div className="flex flex-col gap-2 md:ml-2 md:flex-row">
              <Link className="btn-secondary rounded-2xl" to="/login" onClick={closeMenus}>Login</Link>
              <Link className="btn-primary rounded-2xl" to="/register" onClick={closeMenus}>Register</Link>
            </div>
          ) : (
            <div className="relative md:ml-2">
              <button className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/12 px-3 py-2 text-left text-sm font-bold text-white" onClick={() => setProfileOpen((value) => !value)} type="button">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FC8019] text-xs text-white">{user.fullName?.charAt(0) || 'U'}</span>
                <span className="min-w-0 flex-1 truncate">{user.fullName || user.email}</span>
                <span>V</span>
              </button>
              {profileOpen && (
                <div className="right-0 mt-2 grid gap-1 rounded-[1.25rem] border border-[#EADCCB] bg-white p-2 shadow-soft md:absolute md:w-56">
                  <Link className="rounded-2xl px-3 py-2 text-sm font-bold text-[#7A2E1F] hover:bg-[#FFF7EF]" to={dashboardPath} onClick={closeMenus}>
                    {user.role === 'user' ? 'My Orders' : 'Dashboard'}
                  </Link>
                  <button className="rounded-2xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50" onClick={() => { logout(); closeMenus(); }} type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
