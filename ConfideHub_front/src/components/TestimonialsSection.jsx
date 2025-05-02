import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Community Impact</h2>
          <p className="text-gray-600">How ConfideHub has helped others on their journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="text-4xl text-secondary">❝</div>
            </div>
            <p className="text-gray-700 mb-6 text-center">
              ConfideHub gave me a place to share my struggles with depression without judgment. The supportive comments helped me realize I'm not alone and gave me courage to seek therapy.
            </p>
            <div className="text-center">
              <p className="font-medium">Anonymous User</p>
              <div className="flex justify-center mt-2">
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="text-4xl text-secondary">❝</div>
            </div>
            <p className="text-gray-700 mb-6 text-center">
              When I was going through a tough breakup, the advice I received here helped me process my emotions and move forward. This platform creates a safe space we all need sometimes.
            </p>
            <div className="text-center">
              <p className="font-medium">Anonymous User</p>
              <div className="flex justify-center mt-2">
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="text-4xl text-secondary">❝</div>
            </div>
            <p className="text-gray-700 mb-6 text-center">
              As someone who struggles with social anxiety, ConfideHub lets me express myself without the fear of being identified. The community here is incredibly supportive and understanding.
            </p>
            <div className="text-center">
              <p className="font-medium">Anonymous User</p>
              <div className="flex justify-center mt-2">
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star-half-alt text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-4xl font-bold text-primary">200k+</div>
                <div className="text-sm text-gray-500">Confessions Shared</div>
              </div>
              <div className="h-10 w-px bg-gray-200 mx-4"></div>
              <div className="mr-4">
                <div className="text-4xl font-bold text-secondary">50k+</div>
                <div className="text-sm text-gray-500">Supportive Comments</div>
              </div>
              <div className="h-10 w-px bg-gray-200 mx-4"></div>
              <div>
                <div className="text-4xl font-bold text-tertiary">95%</div>
                <div className="text-sm text-gray-500">Found it Helpful</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;