import React, { useState, useEffect, useCallback, useContext } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { AppContext } from '../../Context/AppProvider';

const CommentSection = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AppContext);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError('');

      // Fetch main comments
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const repliesResponse = await fetch(`/api/posts/comments/${comment.id}/replies`);
          if (repliesResponse.ok) {
            const repliesData = await repliesResponse.json();
            return { ...comment, replies: repliesData };
          }
          return comment;
        })
      );

      setComments(commentsWithReplies);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = useCallback(async (commentData) => {
    try {
      const response = await fetch(`/api/posts/${commentData.postId}/comments?parentId=${commentData.parentId || ''}&content=${encodeURIComponent(commentData.content)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const newComment = await response.json();

      setComments(prev => {
        if (newComment.parentId) {
          // Add reply to parent comment
          return prev.map(comment =>
            comment.id === newComment.parentId
              ? { ...comment, replies: [...(comment.replies || []), newComment] }
              : comment
          );
        } else {
          // Add new top-level comment
          return [{ ...newComment, replies: [] }, ...prev];
        }
      });

      if (onCommentCountChange) {
        onCommentCountChange(1); // Increment comment count in parent
      }

      return newComment;
    } catch (error) {
      console.error('Failed to submit comment', error);
      setError('Couldn\'t post your comment. Please try again.');
      throw error;
    }
  }, [postId, onCommentCountChange]);

  const handleCommentDeleted = useCallback(async (commentId, parentId) => {
    try {
      const response = await fetch(`/api/posts/comments/${commentId}`, {
        method: 'DELETE',
        headers: {},
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || response.statusText || 'Failed to delete comment.';
        setError(errorMessage);
        return;
      }

      setComments(prev => {
        if (parentId) {
          // Remove reply from parent comment
          return prev.map(comment =>
            comment.id === parentId
              ? { ...comment, replies: comment.replies.filter(r => r.id !== commentId) }
              : comment
          );
        } else {
          // Remove top-level comment
          return prev.filter(comment => comment.id !== commentId);
        }
      });

      if (onCommentCountChange) {
        onCommentCountChange(-1); // Decrement comment count in parent
      }
    } catch (error) {
      console.error('Failed to delete comment', error);
      setError('Couldn\'t delete the comment. Please try again.');
    }
  }, [onCommentCountChange]);

  const handleCommentUpdated = useCallback((commentId, updatedComment) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, ...updatedComment } : comment
    ));
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Community Conversation
          </h2>
          <p className="text-gray-500 text-sm">
            Share your perspective and engage with others
          </p>
        </div>

        <div className="mb-8">
          <CommentForm postId={postId} onSubmit={handleCommentSubmit} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchComments}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to start the discussion</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReplyAdded={handleCommentSubmit}
                onCommentUpdated={handleCommentUpdated}
                onDeleteComment={handleCommentDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;