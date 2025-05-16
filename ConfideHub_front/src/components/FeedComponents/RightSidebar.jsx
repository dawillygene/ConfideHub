const RightSidebar = () => {
    return (
      <div className="sidebar w-1/4 ml-4 hidden md:block">
        <div className="sticky top-20">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Crisis Support</h3>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-3">
              <h4 className="font-semibold text-red-700">Crisis Support</h4>
              <p className="text-sm text-gray-700">24/7 Hotline: 1-800-273-8255</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-3">
              <h4 className="font-semibold text-blue-700">Mental Health</h4>
              <p className="text-sm text-gray-700">Text HOME to 741741</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-700">Unknown+ Support</h4>
              <p className="text-sm text-gray-700">Call: 1-866-488-7386</p>
            </div>
            <button className="w-full mt��mt-3 text-blue-500 font-medium hover:underline">
              View All Resources <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">Trending Topics</h3>
            <div className="space-y-3">
              {[
                { tag: '#Anxiety', posts: '24k', color: 'blue' },
                { tag: '#CareerChange', posts: '16k', color: 'green' },
                { tag: '#RelationshipAdvice', posts: '12k', color: 'purple' },
                { tag: '#SelfCare', posts: '9k', color: 'red' },
                { tag: '#Parenting', posts: '7k', color: 'yellow' },
              ].map(({ tag, posts, color }) => (
                <div className="flex items-center" key={tag}>
                  <div className={`w-2 h-2 bg-${color}-500 rounded-full mr-2`}></div>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer">{tag}</span>
                  <span className="text-gray-500 text-xs ml-auto">{posts} posts</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">Community Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {[
                'Be respectful and supportive',
                'Maintain anonymity for yourself and others',
                'No hate speech or harassment',
                'Report concerning content',
              ].map((guideline, index) => (
                <li className="flex items-start" key={index}>
                  <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-3 text-blue-500 font-medium hover:underline">
              Read Full Guidelines
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RightSidebar;