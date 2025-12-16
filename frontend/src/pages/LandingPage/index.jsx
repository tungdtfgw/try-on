import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Hero from './Hero';
import Features from './Features';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[53px] mt-4">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
