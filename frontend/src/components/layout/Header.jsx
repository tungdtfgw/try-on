import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import Container from '../ui/Container';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
      <Container>
        <div className="flex h-[53px] items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-black tracking-[0.12em] text-brand-black text-[19px]"
          >
            <svg className="w-[16.5px] h-[16.5px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span>FASHION</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-semibold uppercase tracking-nav text-brand-grayDark hover:text-brand-black transition-colors"
            >
              Catalogue
            </Link>
            <a
              href="#features"
              className="text-sm font-semibold uppercase tracking-nav text-brand-grayDark hover:text-brand-black transition-colors"
            >
              Fashion
            </a>
            <a
              href="#favourite"
              className="text-sm font-semibold uppercase tracking-nav text-brand-grayDark hover:text-brand-black transition-colors"
            >
              Favourite
            </a>
            <Link
              to="/about"
              className="text-sm font-semibold uppercase tracking-nav text-brand-grayDark hover:text-brand-black transition-colors"
            >
              Lifestyle
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
                <Button size="md" variant="primary">
                  Sign up
                </Button>
              </Link>
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-black focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-black/5 shadow-md">
          <Container className="py-4">
            <nav className="flex flex-col space-y-1">
            <Link
              to="/"
                className="block rounded-sm px-4 py-3 text-base font-semibold uppercase tracking-nav text-brand-grayDark hover:bg-brand-grayLight hover:text-brand-black transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
                Catalogue
            </Link>
            <a
              href="#features"
                className="block rounded-sm px-4 py-3 text-base font-semibold uppercase tracking-nav text-brand-grayDark hover:bg-brand-grayLight hover:text-brand-black transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </a>
              <a
                href="#favourite"
                className="block rounded-sm px-4 py-3 text-base font-semibold uppercase tracking-nav text-brand-grayDark hover:bg-brand-grayLight hover:text-brand-black transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
                Favourite
            </a>
            <Link
              to="/about"
                className="block rounded-sm px-4 py-3 text-base font-semibold uppercase tracking-nav text-brand-grayDark hover:bg-brand-grayLight hover:text-brand-black transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
                Lifestyle
            </Link>
              <div className="pt-3 px-4">
                <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button size="md" variant="primary" className="w-full">
              Sign up
                  </Button>
            </Link>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Header;
