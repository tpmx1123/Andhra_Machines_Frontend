import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Star, Trash2, Edit, Plus, X } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import AlertModal from '../AlertModal';

export default function ReviewsList({ productId, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, reviewId: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const reviewsData = await api.getProductReviews(productId);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message, type = 'info') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleDeleteClick = (reviewId) => {
    setDeleteConfirmModal({ isOpen: true, reviewId });
  };

  const handleDeleteConfirm = async () => {
    const { reviewId } = deleteConfirmModal;
    if (!reviewId) return;

    try {
      await api.deleteReview(productId, reviewId);
      showAlert('Success', 'Review deleted successfully', 'success');
      setDeleteConfirmModal({ isOpen: false, reviewId: null });
      fetchReviews();
    } catch (err) {
      showAlert('Error', err.message || 'Failed to delete review', 'error');
      console.error('Error deleting review:', err);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      userName: review.userName || '',
      rating: review.rating || 5,
      comment: review.comment || '',
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingReview) {
        // For editing, we'll need to delete and recreate since backend doesn't have update endpoint
        await api.deleteReview(productId, editingReview.id);
        await api.addReview(productId, formData);
        showAlert('Success', 'Review updated successfully', 'success');
      } else {
        await api.addReview(productId, formData);
        showAlert('Success', 'Review added successfully', 'success');
      }
      setShowAddForm(false);
      setEditingReview(null);
      setFormData({ userName: '', rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      showAlert('Error', err.message || 'Failed to save review', 'error');
      console.error('Error saving review:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Product Reviews</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingReview(null);
              setFormData({ userName: '', rating: 5, comment: '' });
            }}
            className="flex items-center px-3 py-1.5 text-sm bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Review
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingReview ? 'Edit Review' : 'Add New Review'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513]"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] disabled:opacity-50"
              >
                {editingReview ? 'Update Review' : 'Add Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingReview(null);
                  setFormData({ userName: '', rating: 5, comment: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Add the first review!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{review.userName || 'Anonymous'}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-1.5 text-[#c54513] hover:bg-[#fde8e1] rounded"
                    title="Edit review"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(review.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, reviewId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}

