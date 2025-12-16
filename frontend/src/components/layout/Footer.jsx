import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white pt-xl pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-black tracking-[0.12em] text-white text-[19px]"
            >
              <svg className="w-[16.5px] h-[16.5px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              <span>FASHION</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/80 font-secondary">
              Complete your style with awesome clothes from us.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-[14px] h-[14px] flex items-center justify-center rounded-sm border border-white/30 hover:bg-brand-yellow hover:border-brand-yellow transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="w-[14px] h-[14px] flex items-center justify-center rounded-sm border border-white/30 hover:bg-brand-yellow hover:border-brand-yellow transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-[14px] h-[14px] flex items-center justify-center rounded-sm bg-brand-yellow hover:bg-brand-yellowDark transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-2.5 h-2.5 text-brand-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="text-xs font-bold tracking-nav uppercase mb-4 text-white font-secondary">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="#features" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Career
                </a>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold tracking-nav uppercase mb-4 text-white font-secondary">
              Help
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Delivery Details
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold tracking-nav uppercase mb-4 text-white font-secondary">
              FAQ
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Account
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Manage Deliveries
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Orders
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm font-secondary transition-colors">
                  Payments
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <p className="text-white/60 text-sm font-secondary text-center">
            Fashion.co &copy; 2000-{new Date().getFullYear()}, All Rights Reserved
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
