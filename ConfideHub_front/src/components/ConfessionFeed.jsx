import React from 'react';
import { Link } from 'react-router-dom';

const ConfessionFeed = () => {
  // Store confession data in a constant - keeping only 3-4 best examples for homepage preview
  const confessions = [
    {
      id: 1,
      category: 'Mental Health',
      categoryName: 'Mental Health',
      username: 'Anonymous_User78X',
      time: '2 hours ago',
      content: 'I finally gathered the courage to see a therapist today after years of struggling alone. It wasn\'t as scary as I thought it would be.',
      likes: 24,
      comments: 7,
      hugs: 18,
      selfDestruct: '23 hours',
      hasComment: false,
      commentContent: ''
    },
    {
      id: 2,
      category: 'secondary',
      categoryName: 'Relationships', 
      username: 'Anonymous_User42J',
      time: '5 hours ago',
      content: 'I\'m thinking of breaking up with my partner of 3 years. We\'ve grown apart and want different things, but I\'m scared of being alone again.',
      likes: 16,
      comments: 12,
      hugs: 31,
      selfDestruct: '6 days',
      hasComment: true,
      commentContent: 'I went through something similar last year. It\'s scary, but better than staying in a relationship that isn\'t fulfilling. Take your time to think it through.'
    },
    {
      id: 3,
      category: 'tertiary',
      categoryName: 'Career Stress',
      username: 'Anonymous_User91L',
      time: 'Yesterday',
      content: 'I received a job offer that pays much better, but I\'m afraid to leave my current team. I feel guilty for even considering it.',
      likes: 19,
      comments: 4,
      hugs: 11,
      selfDestruct: 'Never',
      hasPoll: true,
      pollQuestion: 'What would you do?',
      pollOptions: [
        { option: 'Take the new job', percentage: 68, color: 'secondary' },
        { option: 'Stay loyal to current team', percentage: 32, color: 'gray-500' }
      ],
      pollVotes: 38,
      pollEndDate: '5 days'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">See What Others Are Sharing</h2>
          <p className="text-gray-600 mb-6">Get a glimpse of our supportive community</p>
          <div className="flex justify-center gap-4 mb-8">
            <Link 
              to="/feed" 
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300"
            >
              <i className="fas fa-stream mr-2"></i>
              Explore All Posts
            </Link>
            <Link 
              to="/fyp" 
              className="px-6 py-3 bg-white border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300"
            >
              <i className="fas fa-heart mr-2"></i>
              For You Feed
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {confessions.map((confession) => (
            <div key={confession.id} className="confession-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 bg-${confession.category} bg-opacity-10 text-${confession.category} text-xs rounded-full mb-2`}>
                      {confession.categoryName}
                    </span>
                    <h3 className="font-bold">{confession.username}</h3>
                  </div>
                  <span className="text-xs text-gray-500">{confession.time}</span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{confession.content}</p>

                {confession.hasPoll && (
                  <div className="bg-gray-100 p-3 rounded-lg mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">{confession.pollQuestion}</h4>
                    <div className="space-y-2">
                      {confession.pollOptions.map((option) => (
                        <div key={option.option} className="relative pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{`${option.option} (${option.percentage}%)`}</span>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${option.percentage}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${option.color}`}
                            ></div>
                          </div>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-2">
                        {`${confession.pollVotes} votes • Poll ends in ${confession.pollEndDate}`}
                      </div>
                    </div>
                  </div>
                )}

                {confession.hasComment && (
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Anonymous_Supporter</span>
                      <span className="text-xs text-gray-500">3 hours ago</span>
                    </div>
                    <p className="text-gray-700">{confession.commentContent}</p>
                  </div>
                )}

                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <i className="far fa-heart mr-1"></i>
                    <span>{confession.likes}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="far fa-comment mr-1"></i>
                    <span>{confession.comments}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-hands-helping mr-1"></i>
                    <span>{confession.hugs}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">Self-destructs in: {confession.selfDestruct}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Share Your Story?</h3>
            <p className="text-gray-600 mb-6">Join thousands of others in our safe, anonymous community</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/confessions/new" 
                className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300 font-medium"
              >
                <i className="fas fa-pen-alt mr-2"></i>
                Share Your Confession
              </Link>
              <Link 
                to="/feed" 
                className="px-8 py-3 bg-white border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300 font-medium"
              >
                <i className="fas fa-eye mr-2"></i>
                Browse All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfessionFeed;