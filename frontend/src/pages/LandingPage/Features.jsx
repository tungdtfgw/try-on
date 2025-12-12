import React from 'react';

const features = [
  {
    name: 'Real-time Try-on',
    description: 'See how clothes look on you instantly using your camera or uploaded photo.',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'AI Recommendations',
    description: 'Get personalized style suggestions based on your body type and preferences.',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Share with Friends',
    description: 'Share your virtual try-on looks with friends and get their feedback.',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Why choose TryOn?</h2>
          <p className="mt-4 text-lg text-gray-500">
            Our technology brings the fitting room to your home. Discover the features that make virtual shopping a breeze.
          </p>
        </div>
        <div className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {feature.icon}
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
              <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
