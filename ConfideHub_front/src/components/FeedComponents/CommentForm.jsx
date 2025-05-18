import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../Context/AppProvider';

const CommentForm = ({ postId, parentId, onSubmit, onCancel, isReply = false }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Please write something before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (onSubmit) {
        await onSubmit({
          postId,
          parentId,
          content: content.trim(),
        });

        setSubmitted(true);
        setContent('');
        setTimeout(() => {
          setSubmitted(false);
          if (isReply && onCancel) {
            onCancel();
          }
        }, 1500);
      }
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-600 mb-3">Sign in to participate in the conversation</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {/* Add your sign-in handler here */}}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-white ${!isReply ? 'p-6 rounded-xl shadow-sm border border-gray-100 mb-6' : 'p-4 rounded-lg bg-gray-50 border border-gray-200'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-medium text-sm">
            {user?.charAt(0).toUpperCase() || 'Y'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            {isReply ? 'Write your reply' : 'Share your thoughts'}
          </h3>
          
          {error && (
            <div className="bg-red-50 p-2 rounded text-red-600 text-xs mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isReply ? 'Write your reply here...' : 'What would you like to say?'}
              rows={isReply ? 2 : 3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex justify-end space-x-2 mt-3">
              {isReply && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <motion.button
                type="submit"
                className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  isSubmitting || submitted 
                    ? 'bg-blue-400 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || submitted}
              >
                {submitted ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {isReply ? 'Replied' : 'Posted'}
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <span>{isReply ? 'Post Reply' : 'Post Comment'}</span>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentForm;