import React from 'react';

const MentalHealthSupport = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Mental Health Support</h2>
          <p className="text-gray-600">Resources and tools to help you navigate difficult moments</p>
        </div>

        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-4 md:mb-0 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <h3 className="font-bold text-red-600 mt-2">Emergency Help</h3>
            </div>
            <div className="md:w-3/4 md:pl-6">
              <p className="text-gray-700 mb-4">
                If you're experiencing a crisis or having thoughts of suicide, please reach out for immediate help:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-gray-800 mb-1">National Suicide Prevention Lifeline</h4>
                  <p className="text-gray-600 mb-2">24/7 support for those in distress</p>
                  <p className="text-xl font-bold text-primary">1-800-273-8255</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-gray-800 mb-1">Crisis Text Line</h4>
                  <p className="text-gray-600 mb-2">Text-based crisis support</p>
                  <p className="text-xl font-bold text-primary">Text HOME to 741741</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-book text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Resource Library</h3>
              <p className="text-gray-600 mb-4">
                Access our curated collection of articles, guides, and tools for mental wellbeing.
              </p>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-primary hover:underline">
                  <i className="fas fa-file-alt mr-2"></i>
                  <span>Understanding Anxiety</span>
                </a>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <i className="fas fa-file-alt mr-2"></i>
                  <span>Coping with Depression</span>
                </a>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <i className="fas fa-file-alt mr-2"></i>
                  <span>Building Resilience</span>
                </a>
                <a href="#" className="flex items-center text-gray-500 hover:text-primary">
                  <span>View all resources</span>
                  <i className="fas fa-chevron-right ml-2 text-xs"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-calendar-check text-secondary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Mood Tracker</h3>
              <p className="text-gray-600 mb-4">
                Keep track of your emotional wellbeing and identify patterns over time.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">How are you feeling today?</h4>
                <div className="flex justify-between mb-4">
                  <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-tertiary">
                    <span className="text-2xl">😊</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-tertiary">
                    <span className="text-2xl">😐</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-tertiary">
                    <span className="text-2xl">😔</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-tertiary">
                    <span className="text-2xl">😢</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-tertiary">
                    <span className="text-2xl">😡</span>
                  </button>
                </div>
                <button className="w-full py-2 bg-secondary text-white rounded hover:bg-opacity-90 transition">
                  Log Mood
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-hands-helping text-tertiary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Support</h3>
              <p className="text-gray-600 mb-4">
                Connect with licensed therapists and counselors who can provide guidance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 mr-3 bg-gray-200 rounded"></div>
                  <div>
                    <h4 className="font-medium">BetterHelp</h4>
                    <p className="text-xs text-gray-500">Online counseling services</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 mr-3 bg-gray-200 rounded"></div>
                  <div>
                    <h4 className="font-medium">Talkspace</h4>
                    <p className="text-xs text-gray-500">Text & video therapy</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <i className="fas fa-stethoscope text-gray-500 text-xl mr-3"></i>
                  <div>
                    <h4 className="font-medium">Local Therapists</h4>
                    <p className="text-xs text-gray-500">Find help near you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentalHealthSupport;