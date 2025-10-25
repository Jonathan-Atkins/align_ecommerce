import React from "react";

export default function HeroSection() {
  return (
    <section className="bg-white dark:bg-gray-900 py-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4">
        {/* Hero Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            High Risk Merchant Account<br />and Payment Processing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Navigating high-risk industries is challenging, but Align makes it easier with our specialized high-risk merchant account services. Our expert team is dedicated to providing secure and efficient payment processing solutions tailored to your business needs.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A]">99% Approval Rate</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Industry-leading acceptance</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A]">No Setup Fee</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Start processing immediately</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A]">Chargeback Protection</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Advance security features</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A]">24 Hour Approval</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Quick application process</div>
            </div>
          </div>
        </div>
        {/* Form Section */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center">Get Started Today!</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full bg-[#F6A94A] hover:bg-[#e08a1b] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Start Processing Today
              </button>
            </form>
            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Already filled out a form? <a href="/auth" className="text-[#7C8F5A] underline">Login</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}