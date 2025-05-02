import React from 'react';

const HeroSection = () => {
  return (
    <section class="gradient-bg text-white py-16">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-8 md:mb-0">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">Share Your Thoughts, Anonymously</h1>
                    <p class="text-lg mb-6">A safe space to express yourself, seek advice, and connect with others without revealing your identity.</p>
                    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button class="bg-white text-primary font-bold px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300">
                            <i class="fas fa-pen-alt mr-2"></i>Start Confessing
                        </button>
                        <button class="bg-transparent border-2 border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white hover:text-primary transition duration-300">
                            <i class="fas fa-book-reader mr-2"></i>Browse Confessions
                        </button>
                    </div>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <div class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="bg-gray-100 p-4 flex items-center">
                            <div class="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                            <div class="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div class="h-3 w-3 rounded-full bg-green-500"></div>
                            <div class="ml-4 text-sm text-gray-500">Anonymous_User78X</div>
                        </div>
                        <div class="p-6">
                            <div class="text-sm text-gray-500 mb-2">Mental Health • 2 hours ago</div>
                            <p class="text-gray-800 mb-4">I finally gathered the courage to see a therapist today after years of struggling alone. It wasn't as scary as I thought it would be.</p>
                            <div class="flex space-x-3 mb-4">
                                <button class="flex items-center text-gray-600 hover:text-primary">
                                    <i class="far fa-heart mr-1"></i> 24
                                </button>
                                <button class="flex items-center text-gray-600 hover:text-primary">
                                    <i class="far fa-comment mr-1"></i> 7
                                </button>
                                <button class="flex items-center text-gray-600 hover:text-primary">
                                    <i class="far fa-hug mr-1"></i> 18
                                </button>
                            </div>
                            <div class="text-xs text-gray-500">Self-destruct in: 23 hours</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default HeroSection;