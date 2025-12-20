import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Trash2, Users, Mail, Calendar } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function SubscribersList() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getAllSubscribers();
      setSubscribers(response);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching subscribers');
      showToast('Error fetching subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subscriberToDelete) return;

    try {
      await api.deleteSubscriber(subscriberToDelete.id);
      setIsDeleteModalOpen(false);
      setSubscriberToDelete(null);
      await fetchSubscribers();
      showToast('Subscriber removed successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to remove subscriber', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#c54513]" />
          Newsletter Subscribers ({subscribers.length})
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {subscribers.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No subscribers found
            </div>
          ) : (
            subscribers.map((subscriber) => (
              <div key={subscriber.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 break-all">{subscriber.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(subscriber.subscribedAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(subscriber)}
                    className="ml-4 p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                    title="Remove Subscriber"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Subscribed Date
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(subscriber.subscribedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClick(subscriber)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Subscriber"
        message={`Are you sure you want to remove "${subscriberToDelete?.email}" from the newsletter list?`}
      />
    </div>
  );
}

