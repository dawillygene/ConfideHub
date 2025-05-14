import React from 'react';
const FeaturesSection = () => {
  return (
   <>
   <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">How ConfideHub Works</h2>
                <p className="text-gray-600">A platform designed with your privacy and mental wellbeing in mind</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg custom-shadow">
                    <div className="w-14 h-14 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                        <i className="fas fa-user-secret text-2xl text-neutral-100"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Complete Anonymity</h3>
                    <p className="text-gray-600">Share your thoughts without revealing your identity. We mask your IP and use temporary usernames for each confession.</p>
                </div>

                <div className="bg-white p-6 rounded-lg custom-shadow">
                    <div className="w-14 h-14 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mb-4">
                        <i className="fas fa-tags text-2xl text-neutral-100"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Categorized Confessions</h3>
                    <p className="text-gray-600">Find relevant discussions through organized categories and custom tags that help you connect with similar experiences.</p>
                </div>

                <div className="bg-white p-6 rounded-lg custom-shadow">
                    <div className="w-14 h-14 rounded-full bg-tertiary bg-opacity-10 flex items-center justify-center mb-4">
                        <i className="fas fa-hands-helping text-2xl text-neutral-100"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Community Support</h3>
                    <p className="text-gray-600">Receive advice, encouragement, and support from others who understand what you're going through.</p>
                </div>

                <div className="bg-white p-6 rounded-lg custom-shadow">
                    <div className="w-14 h-14 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                        <i className="fas fa-shield-alt text-2xl text-neutral-100"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Safety First</h3>
                    <p className="text-gray-600">Advanced content moderation and reporting systems ensure a safe, respectful environment for everyone.</p>
                </div>

                <div className="bg-white p-6 rounded-lg custom-shadow">
                    <div className="w-14 h-14 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mb-4">
                        <i className="fa fa-brain text-2xl text-neutral-100"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Mental Health Resources</h3>
                    <p className="text-gray-600">Access to emergency hotlines, professional advice, and a resource hub for mental health support.</p>
                </div>

                <div className="bg-white p-6 rounded-lg custom-shadow">
                    <div className="w-14 h-14 rounded-full bg-tertiary bg-opacity-10 flex items-center justify-center mb-4">
                        <i className="fas fa-medal text-2xl text-neutral-100"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Recognition System</h3>
                    <p className="text-gray-600">Earn badges and kudos for supporting others, creating a positive feedback loop of encouragement.</p>
                </div>
            </div>
        </div>
    </section>
   </>
  );
};

export default FeaturesSection;