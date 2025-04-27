import React from 'react';
import { Link } from 'react-router-dom';
// Optional: Import an icon library if you have one, e.g., react-icons
import { FiMessageSquare, FiLock, FiUsers } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))]"> {/* Adjust min-height based on your navbar/footer height */}

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-20 md:py-32">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Welcome to Virio Chaat
          </h1>
          <p className="text-lg md:text-xl mb-8 text-indigo-100">
            Connect instantly, chat seamlessly. Your new favorite place to talk.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signin" // Assuming signin handles both login and redirects to signup if needed
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            {/* Optional: Add a "Learn More" button that scrolls down */}
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 md:mb-16">
            Why Choose Virio Chaat?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Optional Icon */}
              <FiMessageSquare className="text-4xl text-indigo-500 mx-auto mb-4" />
              <div className="text-5xl mb-4">💬</div> {/* Emoji Placeholder */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Messaging</h3>
              <p className="text-gray-600">
                Experience lightning-fast message delivery and stay connected without delays.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Optional Icon */}
              <FiLock className="text-4xl text-purple-500 mx-auto mb-4" />
              <div className="text-5xl mb-4">🔒</div> {/* Emoji Placeholder */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your conversations are important. We prioritize security and privacy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Optional Icon */}
              <FiUsers className="text-4xl text-pink-500 mx-auto mb-4" />
               <div className="text-5xl mb-4">✨</div> {/* Emoji Placeholder */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Simple & Intuitive</h3>
              <p className="text-gray-600">
                A clean interface designed for ease of use. Start chatting in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 bg-indigo-600 text-white px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Chatting?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-indigo-100">
            Join the Virio Chaat community today. It's free!
          </p>
          <Link
            to="/signin"
            className="bg-white text-indigo-600 font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign Up / Sign In
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
