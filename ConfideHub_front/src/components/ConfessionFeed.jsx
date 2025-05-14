import React from 'react';

const ConfessionFeed = () => {
  // Store confession data in a constant
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
    },
    {
      id: 4,
      category: 'primary',
      categoryName: 'Mental Health',
      username: 'Anonymous_User34K',
      time: '3 days ago',
      content: 'I can\'t stop procrastinating on important tasks. It\'s affecting my studies and I\'m falling behind. How do I break this cycle?',
      likes: 42,
      comments: 8,
      hugs: 27,
      selfDestruct: 'Never',
      hasProfessionalAdvice: true,
      adviceContent: 'Procrastination often stems from perfectionism or feeling overwhelmed. Try breaking tasks into smaller, manageable chunks and use the Pomodoro technique (25 min work, 5 min break). Also, consider if there are underlying anxiety issues that might benefit from professional support.'
    },
    {
      id: 5,
      category: 'secondary',
      categoryName: 'Family Issues',
      username: 'Anonymous_User56P',
      time: '4 days ago',
      content: 'My parents don\'t approve of my career choice. They want me to be a doctor, but I\'m passionate about music. I feel torn between my dreams and their expectations.',
      likes: 31,
      comments: 15,
      hugs: 29,
      selfDestruct: '3 days'
    },
    {
      id: 6,
      category: 'tertiary',
      categoryName: 'invalid+ Safe Space',
      username: 'Anonymous_User63M',
      time: '1 week ago',
      content: 'I came out to my best friend yesterday, and their supportive reaction brought me to tears. For the first time, I feel like I can be myself around someone.',
      likes: 87,
      comments: 23,
      hugs: 64,
      selfDestruct: 'Never'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Recent Confessions</h2>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Most Recent</option>
              <option>Most Supported</option>
              <option>Most Commented</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {confessions.map((confession) => (
            <div key={confession.id} className="confession-card bg-white rounded-lg shadow-md overflow-hidden">
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

                <p className="text-gray-700 mb-4">{confession.content}</p>

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

                {confession.hasProfessionalAdvice && (
                  <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-primary border-opacity-20">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user-md text-primary mr-2"></i>
                      <span className="font-medium">Professional Advice</span>
                      <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">Verified</span>
                    </div>
                    <p className="text-gray-700 text-sm">{confession.adviceContent}</p>
                  </div>
                )}

                <div className="flex space-x-4 mb-4">
                  <button className="flex items-center text-gray-600 hover:text-red-500 transition">
                    <i className="far fa-heart mr-1"></i>
                    <span>{confession.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-primary transition">
                    <i className="far fa-comment mr-1"></i>
                    <span>{confession.comments}</span>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-yellow-500 transition">
                    <i className="far fa-hug mr-1"></i>
                    <span>{confession.hugs}</span>
                  </button>
                </div>

                <div className="text-sm text-gray-500">Self-destructs in: {confession.selfDestruct}</div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-user text-gray-500 text-xs"></i>
                  </div>
                  <div className="flex-grow">
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Share your support..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="px-6 py-3 bg-white border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300">
            Load More Confessions
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfessionFeed;