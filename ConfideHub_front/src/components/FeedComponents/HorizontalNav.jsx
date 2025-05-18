import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppProvider';

const NavItems = [
  {
    name: 'Profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    path: '/profile',
    color: 'bg-blue-100 text-blue-500'
  },
  {
    name: 'Mental',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    path: '/mental-health',
    color: 'bg-purple-100 text-purple-500'
  },
  {
    name: 'Relations',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
      </svg>
    ),
    path: '/relationships',
    color: 'bg-pink-100 text-pink-500'
  },
  {
    name: 'Career',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    ),
    path: '/career',
    color: 'bg-green-100 text-green-500'
  },
  {
    name: 'Family',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 100-6 3 3 0 000 6zM17 6a3 3 0 100-6 3 3 0 000 6zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
    path: '/family',
    color: 'bg-orange-100 text-orange-500'
  },
  {
    name: 'Other',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
    path: '/other',
    color: 'bg-indigo-100 text-indigo-500'
  }
];

const StatusBar = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="flex overflow-x-auto py-2 px-4 gap-2 hide-scrollbar bg-white shadow-sm">
      {/* Profile Link with user context */}
      <Link 
        to="/profile" 
        className="flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="p-2 rounded-full mb-1 bg-blue-100 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs font-medium whitespace-nowrap">
          {user ? user.substring(0, 8) : 'Profile'}
        </span>
      </Link>

      {/* Category Links */}
      {NavItems.slice(1).map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className={`p-2 rounded-full mb-1 ${item.color}`}>
            {item.icon}
          </div>
          <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default StatusBar;