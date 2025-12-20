import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function BlogsList({ onEdit, refreshKey, onDelete }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getAllBlogs();
      setBlogs(response);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching blogs');
      showToast('Error fetching blogs', 'error');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      setLoading(true);
      await api.deleteBlog(blogToDelete.id);
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
      await fetchBlogs();
      if (onDelete) onDelete();
      showToast('Blog post deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting blog:', err);
      showToast(err.message || 'Failed to delete blog', 'error');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {blogs.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">No blog posts found</div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="p-4 hover:bg-gray-50">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="h-20 w-28 object-cover rounded" />
                  ) : (
                    <div className="h-20 w-28 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{blog.title}</div>
                  <div className="text-xs text-gray-500 mb-2 truncate">{blog.slug}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category || 'Uncategorized'}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(blog)}
                      className="p-1.5 text-[#c54513] hover:text-[#a43a10] hover:bg-[#fde8e1] rounded-md transition-colors"
                      title="Edit blog"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No blog posts found</td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.imageUrl ? (
                      <img src={blog.imageUrl} alt={blog.title} className="h-16 w-24 object-cover rounded" />
                    ) : (
                      <div className="h-16 w-24 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</div>
                    <div className="text-xs text-gray-500">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onEdit(blog)} className="text-[#c54513] hover:text-[#a43a10]">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(blog)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}


