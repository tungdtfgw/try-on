import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';

const categories = [
  {
    name: 'Hoodies & Sweetshirt',
    image: null,
    cta: 'Explore Now!',
    bgColor: 'bg-brand-orange',
  },
  {
    name: 'Coats & Parkas',
    image: null,
    cta: 'Explore Now!',
    bgColor: 'bg-brand-purple',
  },
  {
    name: 'Tees & T-Shirt',
    image: null,
    cta: 'Explore Now!',
    bgColor: 'bg-brand-cyan',
  },
];

const Features = () => {
  return (
    <section className="bg-white pt-xl pb-2xl" id="features">
      <Container>
        {/* Section heading with decorative underline */}
        <div className="mb-xl">
          <h2 className="text-section-heading-sm font-black text-brand-black tracking-heading uppercase inline-block relative">
            NEW ARRIVALS
            <svg 
              className="absolute -bottom-2 left-0 w-full h-2" 
              viewBox="0 0 100 8" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,4 Q25,0 50,4 T100,4" 
                fill="none" 
                stroke="#EBD96B" 
                strokeWidth="8"
              />
            </svg>
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xl">
          {categories.map((category, index) => (
            <Card 
              key={index}
              className="overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-card"
            >
              {/* Product image */}
              <div className={`aspect-[230/334] ${category.bgColor} relative overflow-hidden rounded-t-md`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/40"
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
                </div>
              </div>

              {/* Product content */}
              <div className="p-4">
                <h3 className="text-product-title font-medium text-brand-black">
                  {category.name}
                </h3>
                <div className="mt-2 flex items-center gap-1 text-brand-grayMedium group-hover:text-brand-black transition-colors">
                  <span className="text-[10.45px] font-medium">{category.cta}</span>
                  <svg 
                    className="w-3 h-3 transition-transform group-hover:translate-x-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Young's Favourite Section */}
        <div className="mt-2xl">
          <div className="mb-xl">
            <h2 className="text-[13px] font-black text-brand-black tracking-heading uppercase inline-block relative">
              Young&apos;s Favourite
              <svg 
                className="absolute -bottom-2 left-0 w-full h-2" 
                viewBox="0 0 100 8" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M0,4 Q25,0 50,4 T100,4" 
                  fill="none" 
                  stroke="#EBD96B" 
                  strokeWidth="8"
                />
              </svg>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            <Card 
              className="overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-card"
            >
              <div className="aspect-[2/1] bg-brand-beige relative overflow-hidden rounded-md">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-white/40"
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
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-brand-black">
                    Trending on instagram
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-brand-grayDark group-hover:text-brand-black transition-colors">
                    <span className="text-sm font-medium">Explore Now!</span>
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card 
              className="overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-card"
            >
              <div className="aspect-[2/1] bg-brand-pink relative overflow-hidden rounded-md">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-white/40"
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
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-brand-black">
                    All Under $40
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-brand-grayDark group-hover:text-brand-black transition-colors">
                    <span className="text-sm font-medium">Explore Now!</span>
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Brand Showcase Section */}
        <div className="mt-2xl">
          <div className="h-[82px] bg-brand-yellow rounded-md flex items-center justify-center overflow-x-auto">
            <div className="flex items-center gap-[57px] px-8">
              {['H&M', 'OBEY', 'SHOPIFY', 'LACOSTE', 'LEVIS', 'AMAZON'].map((brand) => (
                <div key={brand} className="text-3xl font-black text-brand-black/70 whitespace-nowrap tracking-wider">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download App Section */}
        <div className="mt-2xl">
          <div className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-purpleLight p-8 lg:p-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-heading uppercase leading-tight">
                  Download App & Get The Voucher!
                </h2>
                <p className="mt-4 text-lg text-white font-medium">
                  Get 30% off for first transaction using Rondovision mobile app for now.
                </p>
                <div className="mt-6 flex gap-3">
                  <div className="h-10 bg-white/20 rounded px-4 flex items-center text-white text-sm font-medium">
                    App Store
                  </div>
                  <div className="h-10 bg-white/20 rounded px-4 flex items-center text-white text-sm font-medium">
                    Google Play
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 flex justify-center">
                <div className="w-48 h-64 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white/60 text-sm">App Mockup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-2xl mb-20">
          <div className="rounded-lg bg-gradient-to-r from-brand-cyan to-brand-cyanLight p-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-heading uppercase leading-tight">
              Join Shopping Community To Get Monthly Promo
            </h2>
            <p className="mt-3 text-lg text-white font-medium">
              Type your email down below and be young wild generation
            </p>
            <div className="mt-6 max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Add your email here"
                className="flex-1 h-[30px] rounded-sm bg-white px-[7.3px] py-[6.5px] text-sm text-brand-grayDark placeholder:text-[#767676] focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-2 bg-brand-black text-white rounded-sm font-medium uppercase text-sm hover:bg-[#333] transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
