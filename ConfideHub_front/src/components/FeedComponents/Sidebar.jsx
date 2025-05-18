import { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../Context/AppProvider';

const CATEGORIES = [
    'Mental Health',
    'Relationships',
    'Career Stress',
    'Family Issues',
    'Unknown+ Space',
  ];
  
  const Sidebar = () => {
      const { user } = useContext(AppContext);
    return (
      <div className="sidebar w-1/4 mr-4 hidden md:block">
        <div className="sticky top-20">
          <div className="sidebar-item">
            <div className="sidebar-icon bg-blue-100">
              <i className="fas fa-user text-blue-500"></i>
            </div>
            <span className="font-medium">Welcome {user}</span>
          </div>
          {CATEGORIES.map((category) => (
            <div className="sidebar-item" key={category}>
              <div className={`sidebar-icon bg-${category === 'Mental Health' ? 'purple' : category === 'Relationships' ? 'pink' : category === 'Career Stress' ? 'green' : category === 'Family Issues' ? 'orange' : 'red'}-100`}>
                <i className={`fas fa-${category === 'Mental Health' ? 'heart' : category === 'Relationships' ? 'users' : category === 'Career Stress' ? 'briefcase' : category === 'Family Issues' ? 'home' : 'rainbow'} text-${category === 'Mental Health' ? 'purple' : category === 'Relationships' ? 'pink' : category === 'Career Stress' ? 'green' : category === 'Family Issues' ? 'orange' : 'red'}-500`}></i>
              </div>
              <span className="font-medium">{category}</span>
            </div>
          ))}
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">Crisis Support Hotline: 1-800-273-8255</p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Get Support
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;