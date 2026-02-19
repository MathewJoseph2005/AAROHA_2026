import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import sargamLogo from '@/assets/icon_logo.png';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Rules', href: '/#rules' },
    { label: 'Criteria', href: '/#criteria' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={sargamLogo}
              alt="SARGAM"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5)) drop-shadow(0 0 20px rgba(139,92,246,0.2))' }}
            />
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              SARGAM 2026
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/5 ${location.pathname === link.href
                  ? 'text-white'
                  : 'text-gray-400'
                  }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin" className="gap-2 text-violet-400 hover:text-violet-300">
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm text-gray-300">{user?.name || user?.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="neon-outline" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button variant="neon" size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const hash = link.href.includes('#') ? link.href.split('#')[1] : null;
                    if (location.pathname !== '/') {
                      navigate('/');
                      if (hash) {
                        setTimeout(() => {
                          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }
                    } else if (hash) {
                      setTimeout(() => {
                        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 space-y-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" className="w-full justify-start gap-2 text-violet-400" asChild>
                        <Link to="/admin" onClick={() => setMobileOpen(false)}>
                          <ShieldCheck className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-400" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="neon-outline" className="w-full" asChild>
                      <Link to="/auth" onClick={() => setMobileOpen(false)}>Login</Link>
                    </Button>
                    <Button variant="neon" className="w-full" asChild>
                      <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
