import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext'; // Assuming AuthContext provides user and logout
// import { CartContext } from '../contexts/CartContext'; // Assuming CartContext provides cartItemCount

const NavLink = ({ to, children, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}    
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, exact = false, onClick }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}    
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const { user, logout } = useContext(AuthContext);
  // const { cartItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  // Placeholder values - replace with context
  const user = null; // or { name: 'Test User', role: 'buyer' }
  const cartItemCount = 0; 
  const logout = () => { console.log('Logout'); navigate('/auth'); };

  const commonLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/products", label: "Shop All" },
    // { to: "/#categories", label: "Categories" }, // For in-page links, need different handling or ensure page structure supports it
    // { to: "/#why-us", label: "Why Us?" },
  ];

  const userSpecificLinks = () => {
    if (user) {
      let links = [
        { to: "/dashboard/user", label: "My Account" },
      ];
      if (user.role === 'seller') {
        links.push({ to: "/dashboard/seller", label: "Seller Portal" });
      }
      return links;
    } 
    return [];
  };

  const navLinks = [...commonLinks, ...userSpecificLinks()];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-[#007BFF]">Re<span className="text-gray-700">New</span></span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => <NavLink key={link.to} to={link.to} exact={link.exact}>{link.label}</NavLink>)}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                Logout
              </button>
            ) : (
              <NavLink to="/auth">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login/Register
              </NavLink>
            )}
            <NavLink to="/cart" >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart ({cartItemCount})
            </NavLink>
            <div className="md:hidden ml-2">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile menu, show/hide based on menu state. */} 
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map(link => <MobileNavLink key={link.to} to={link.to} exact={link.exact} onClick={() => setMobileMenuOpen(false)}>{link.label}</MobileNavLink>)}
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-['Poppins'] font-semibold mb-4">Re<span className="text-[#007BFF]">New</span></h3>
            <p className="text-gray-400">Your trusted marketplace for quality refurbished electronics.</p>
          </div>
          <div>
            <h4 className="text-lg font-['Poppins'] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Shop</Link></li>
              <li><Link to="/auth" className="hover:text-blue-400 transition-colors">My Account</Link></li>
              <li><Link to="/dashboard/seller" className="hover:text-blue-400 transition-colors">Seller Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-['Poppins'] font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-['Poppins'] font-semibold mb-4">Stay Connected</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07A4.48 4.48 0 0015.68 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.94.07 4.28 4.28 0 004 2.98 8.52 8.52 0 01-5.33 1.84c-.34 0-.68-.02-1.01-.06A12.07 12.07 0 008.25 20c6.31 0 9.77-5.23 9.77-9.77 0-.15 0-.3-.01-.45.67-.48 1.25-1.09 1.7-1.78z"></path></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.63-5.373-12-12-12z"></path></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ReNew Marketplace. All rights reserved. Prototype for design purposes.</p>
        </div>
      </div>
    </footer>
  );
};

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen font-['Inter'] bg-[#F8F9FA] text-[#343A40]">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
