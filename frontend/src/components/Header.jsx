import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path 
      ? "px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100 transition-colors"
      : "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors";
  };

  const getMobileNavLinkClass = (path) => {
    return location.pathname === path
      ? "block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-100 transition-colors"
      : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors";
  };

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
              <Link to="/" className={getNavLinkClass('/')}>Home</Link>
              <Link to="/products" className={getNavLinkClass('/products')}>Shop All</Link>
              {/* <Link to="/#categories" className={getNavLinkClass('/#categories')}>Categories</Link> */}
              {/* <Link to="/#why-us" className={getNavLinkClass('/#why-us')}>Why Us?</Link> */}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                {user.role === 'buyer' && <Link to="/dashboard/user" className={getNavLinkClass('/dashboard/user')}>My Account</Link>}
                {user.role === 'seller' && <Link to="/dashboard/seller" className={getNavLinkClass('/dashboard/seller')}>Seller Portal</Link>}
                <button onClick={handleLogout} className={getNavLinkClass('/logout')}>Logout</button> {/* Note: /logout might not be a real path, adjust if needed */}
              </>
            ) : (
              <Link to="/auth" className={getNavLinkClass('/auth')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login/Register
              </Link>
            )}
            <Link to="/cart" className={`${getNavLinkClass('/cart')} ml-2 relative`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart 
              {cartItemCount > 0 && 
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {cartItemCount}
                </span>
              }
            </Link>
            <div className="md:hidden ml-2">
              <button 
                id="mobile-menu-button" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
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

      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className={getMobileNavLinkClass('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className={getMobileNavLinkClass('/products')} onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
          {/* <Link to="/#categories" className={getMobileNavLinkClass('/#categories')} onClick={() => setIsMobileMenuOpen(false)}>Categories</Link> */}
          {/* <Link to="/#why-us" className={getMobileNavLinkClass('/#why-us')} onClick={() => setIsMobileMenuOpen(false)}>Why Us?</Link> */}
          {user ? (
            <>
              {user.role === 'buyer' && <Link to="/dashboard/user" className={getMobileNavLinkClass('/dashboard/user')} onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>}
              {user.role === 'seller' && <Link to="/dashboard/seller" className={getMobileNavLinkClass('/dashboard/seller')} onClick={() => setIsMobileMenuOpen(false)}>Seller Portal</Link>}
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={`${getMobileNavLinkClass('/logout')} w-full text-left`}>Logout</button>
            </>
            ) : (
            <Link to="/auth" className={getMobileNavLinkClass('/auth')} onClick={() => setIsMobileMenuOpen(false)}>Login/Register</Link>
          )}
           <Link to="/cart" className={`${getMobileNavLinkClass('/cart')} relative`} onClick={() => setIsMobileMenuOpen(false)}>
              Cart 
              {cartItemCount > 0 && 
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ml-2">
                  {cartItemCount}
                </span>
              }
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
