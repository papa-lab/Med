import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Stethoscope } from 'lucide-react';

interface NavigationProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLogoClick?: () => void;
  onDashboardClick?: () => void;
  onGetStarted?: () => void;
  currentView?: 'landing' | 'dashboard';
}

export default function Navigation({ 
  isDarkMode, 
  toggleDarkMode, 
  onLogoClick,
  onDashboardClick,
  onGetStarted,
  currentView = 'landing'
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = currentView === 'dashboard' 
    ? [
        { label: 'Dashboard', onClick: onDashboardClick },
        { label: 'Study', href: '#study' },
        { label: 'Community', href: '#community' },
        { label: 'Resources', href: '#resources' },
      ]
    : [
        { label: 'Features', href: '#features' },
        { label: 'Community', href: '#community' },
        { label: 'Resources', href: '#resources' },
        { label: 'Pricing', href: '#pricing' },
      ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-med-bg-dark/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-med-teal flex items-center justify-center 
                          group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-med-text dark:text-white">
              MedStudy
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || '#'}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className="text-sm font-medium text-med-text-secondary dark:text-gray-400 
                         hover:text-med-text dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                       bg-gray-100 dark:bg-white/5 text-med-text dark:text-white
                       hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Get Started Button - Desktop */}
            {currentView === 'landing' && (
              <button
                onClick={onGetStarted}
                className="hidden lg:block med-btn-primary text-sm"
              >
                Get started
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center
                       bg-gray-100 dark:bg-white/5 text-med-text dark:text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-med-bg-dark border-t dark:border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || '#'}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="block px-4 py-3 rounded-xl text-sm font-medium
                         text-med-text dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            {currentView === 'landing' && (
              <button
                onClick={() => {
                  onGetStarted?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-4 med-btn-primary text-sm"
              >
                Get started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
