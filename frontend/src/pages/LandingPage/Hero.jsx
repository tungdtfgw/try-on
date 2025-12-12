import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32">
      <div className="relative">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
          <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
            <div>
              <div className="mt-6">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  New Feature
                </span>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Virtual Try-On for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Everyone</span>
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Experience fashion like never before. Try on clothes virtually with our cutting-edge AI technology. No more guessing, just perfect fits.
                </p>
                <div className="mt-6">
                  <Link
                    to="/try-on"
                    className="inline-flex px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors"
                  >
                    Try Now
                  </Link>
                  <Link
                    to="/about"
                    className="ml-4 inline-flex px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex items-center justify-center relative">
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-300 blur-3xl opacity-30 animate-blob"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-pink-300 blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                  
                  <div className="relative z-10 text-center p-8">
                     <svg className="w-24 h-24 mx-auto text-purple-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <p className="mt-4 text-gray-500 font-medium">Interactive Demo Placeholder</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
