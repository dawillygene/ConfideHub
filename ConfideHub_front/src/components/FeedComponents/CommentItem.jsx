import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import CommentForm from './CommentForm';
import { AppContext } from '../../Context/AppProvider';

const CommentItem = ({ comment, onReplyAdded, onCommentUpdated, onDeleteComment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useContext(AppContext);

  const isCommentAuthor = user && comment.user?.username === user;

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/comments/${comment.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const data = await response.json();
      setLiked(data.isLiked);
      setLikesCount(data.likesCount);
      
      if (onCommentUpdated) {
        onCommentUpdated(comment.id, {
          ...comment,
          likes: data.likesCount,
          isLiked: data.isLiked
        });
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteComment || !comment.id) return;

    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteError('');
      
      const response = await fetch(`/api/posts/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      onDeleteComment(comment.id);
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = async (replyData) => {
    try {
      const response = await fetch(`/api/posts/posts/${comment.postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyData.content,
          parentId: comment.id
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const newReply = await response.json();
      
      if (onReplyAdded) {
        onReplyAdded(comment.id, newReply);
      }
      
      setShowReplyForm(false);
    } catch (error) {
      console.error('Reply error:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="comment-item group relative"
    >
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {comment.user?.username?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-gray-800">
                {comment.user?.username || 'Anonymous'}
              </h4>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {isCommentAuthor && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete comment"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          <p className="text-gray-700 mt-1 text-sm">{comment.content}</p>

          {deleteError && (
            <div className="mt-2 px-3 py-2 text-xs text-red-600 bg-red-50 rounded-lg">
              {deleteError}
            </div>
          )}

          <div className="mt-2 flex items-center space-x-4">
            <button
              className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-xs"
              onClick={handleLike}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={liked ? 0 : 2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </button>

            {user && (
              <button
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Reply
              </button>
            )}
          </div>

          {showReplyForm && user && (
            <div className="mt-3">
              <CommentForm
                postId={comment.postId}
                parentId={comment.id}
                onSubmit={handleReplySubmit}
                onCancel={() => setShowReplyForm(false)}
                isReply={true}
              />
            </div>
          )}

          {comment.replies?.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReplyAdded={onReplyAdded}
                  onCommentUpdated={onCommentUpdated}
                  onDeleteComment={onDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;