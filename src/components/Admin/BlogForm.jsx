import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export default function BlogForm({ blog, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Initialize TinyMCE
    if (window.tinymce) {
      window.tinymce.init({
        selector: '#blog-content-editor',
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: (editor) => {
          editorRef.current = editor;
          editor.on('change', () => {
            setFormData(prev => ({ ...prev, content: editor.getContent() }));
          });
        }
      });
    }

    return () => {
      if (window.tinymce) {
        window.tinymce.remove('#blog-content-editor');
      }
    };
  }, []);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        imageUrl: blog.imageUrl || '',
        category: blog.category || '',
      });
      
      // Update TinyMCE content if it exists
      if (editorRef.current) {
        editorRef.current.setContent(blog.content || '');
      }
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title' && !blog) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generatedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      showToast('Please select an image file', 'error');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const response = await api.uploadImage(file);
      if (response.url) {
        setFormData(prev => ({ ...prev, imageUrl: response.url }));
        showToast('Image uploaded successfully', 'success');
      } else {
        setError(response.error || 'Failed to upload image');
        showToast(response.error || 'Failed to upload image', 'error');
      }
    } catch (err) {
      setError('Failed to upload image');
      showToast('Failed to upload image', 'error');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.slug || !formData.content) {
      setError('Title, slug, and content are required');
      showToast('Title, slug, and content are required', 'error');
      return;
    }

    try {
      setLoading(true);
      if (blog) {
        await api.updateBlog(blog.id, formData);
        showToast('Blog post updated successfully', 'success');
      } else {
        await api.createBlog(formData);
        showToast('Blog post created successfully', 'success');
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save blog post');
      showToast(err.message || 'Failed to save blog post', 'error');
      console.error('Error saving blog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {blog ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c54513]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c54513]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <div className="flex items-center space-x-4">
            {formData.imageUrl ? (
              <div className="relative">
                <img src={formData.imageUrl} alt="Preview" className="h-32 w-48 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="h-32 w-48 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Or enter image URL directly"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c54513]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Sewing Tips"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c54513]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c54513]"
            placeholder="Brief summary of the post..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content (TinyMCE Editor)</label>
          <textarea
            id="blog-content-editor"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c54513]"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a4370f] disabled:opacity-50"
          >
            {loading ? 'Saving...' : blog ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

