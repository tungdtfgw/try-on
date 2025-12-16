import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';

const Hero = () => {
  return (
    <section className="bg-white py-xl">
      <Container>
        <div className="rounded-lg bg-gradient-to-br from-brand-yellowLight to-brand-yellow p-8 lg:p-xl overflow-hidden relative min-h-[405px] lg:min-h-[600px]">
          {/* Decorative stars */}
          <div className="absolute top-8 right-20 w-[27.66px] h-[27.66px] rotate-[333deg] opacity-60">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-orange">
              <polygon points="12,2 15,10 23,12 15,14 12,22 9,14 1,12 9,10" />
            </svg>
          </div>
          <div className="absolute bottom-12 left-16 w-[27.66px] h-[27.66px] rotate-[333deg] opacity-60">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-orange">
              <polygon points="12,2 15,10 23,12 15,14 12,22 9,14 1,12 9,10" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-8 w-[20px] h-[20px] rotate-45 opacity-40">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-pink">
              <polygon points="12,2 15,10 23,12 15,14 12,22 9,14 1,12 9,10" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center relative z-10">
            {/* Left content - 40% */}
            <div className="lg:col-span-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight text-brand-black tracking-heading uppercase">
                LET&apos;S EXPLORE{' '}
                <span className="relative inline-block">
                  <span className="absolute inset-0 -z-10 bg-white rounded-sm transform rotate-[-2deg]" />
                  UNIQUE
                </span>{' '}
                CLOTHES.
              </h1>
              <p className="mt-6 text-lg text-brand-black/70 leading-relaxed font-medium">
                Live for Influential and Innovative fashion!
              </p>

              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg" variant="primary">
                    Shop now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right image - 60% */}
            <div className="lg:col-span-3 relative">
              <div className="aspect-[4/3] rounded-lg bg-white shadow-card border border-black/5 flex items-center justify-center overflow-hidden">
                <div className="text-center px-6">
                  <svg
                    className="w-24 h-24 mx-auto text-brand-grayMedium/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-brand-grayMedium">
                    Hero Image Placeholder
                  </p>
                </div>
              </div>
              {/* Decorative star on image */}
              <div className="absolute -top-4 -right-4 w-[27.66px] h-[27.66px] rotate-[333deg]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-cyan">
                  <polygon points="12,2 15,10 23,12 15,14 12,22 9,14 1,12 9,10" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -left-4 w-[20px] h-[20px] rotate-45">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-purple">
                  <polygon points="12,2 15,10 23,12 15,14 12,22 9,14 1,12 9,10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
