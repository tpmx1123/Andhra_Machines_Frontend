import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

// Helper function to convert date string to local datetime-local format
const convertToLocalDateTime = (dateString) => {
  try {
    // Parse the date string (stored as UTC ISO string)
    const date = new Date(dateString);
    // Format as datetime-local using local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error('Error converting date:', e);
    return '';
  }
};

export default function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    mainImageUrl: '',
    galleryImages: '',
    brandName: '',
    brandSlug: '',
    inStock: true,
    isOnSale: false,
    isNew: false,
    highlights: '',
    specType: '',
    specStitches: '',
    specButtonholes: '',
    specStitchWidth: '',
    specStitchLength: '',
    specSpeed: '',
    specWarranty: '',
    scheduledPrice: '',
    priceStartDate: '',
    priceEndDate: '',
  });
  const galleryFileRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      // Parse specifications JSON if it exists
      let specs = {};
      if (product.specificationsJson) {
        try {
          specs = typeof product.specificationsJson === 'string' 
            ? JSON.parse(product.specificationsJson) 
            : product.specificationsJson;
        } catch {
          specs = {};
        }
      }

      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        imageUrl: product.imageUrl || '',
        mainImageUrl: product.mainImageUrl || '',
        galleryImages: product.galleryImages ? product.galleryImages.join('\n') : '',
        brandName: product.brandName || '',
        brandSlug: product.brandSlug || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        isOnSale: product.isOnSale || false,
        isNew: product.isNew || false,
        highlights: product.highlights ? product.highlights.join('\n') : '',
        specType: specs.Type || '',
        specStitches: specs.Stitches || '',
        specButtonholes: specs.Buttonholes || '',
        specStitchWidth: specs['Stitch Width'] || '',
        specStitchLength: specs['Stitch Length'] || '',
        specSpeed: specs.Speed || '',
        specWarranty: specs.Warranty || '',
        scheduledPrice: product.scheduledPrice || '',
        priceStartDate: product.priceStartDate
          ? convertToLocalDateTime(product.priceStartDate)
          : '',
        priceEndDate: product.priceEndDate
          ? convertToLocalDateTime(product.priceEndDate)
          : '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleImageUpload = async (e, type = 'main', galleryIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const response = await api.uploadImage(file);
      if (response.url) {
        if (type === 'main') {
          setFormData({ ...formData, mainImageUrl: response.url });
        } else if (type === 'gallery' && galleryIndex !== null) {
          const currentGallery = formData.galleryImages.split('\n').filter(url => url.trim());
          // Ensure we have enough slots
          while (currentGallery.length <= galleryIndex) {
            currentGallery.push('');
          }
          currentGallery[galleryIndex] = response.url;
          setFormData({ ...formData, galleryImages: currentGallery.join('\n') });
        } else {
          setFormData({ ...formData, imageUrl: response.url });
        }
      } else {
        setError(response.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.price) {
      setError('Title and price are required');
      return;
    }

    try {
      setLoading(true);
      
      // Parse highlights (split by newline)
      const highlights = formData.highlights
        .split('\n')
        .map(h => h.trim())
        .filter(h => h.length > 0);

      // Parse gallery images (split by newline)
      const galleryImages = formData.galleryImages
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      // Build specifications JSON from individual fields
      let specificationsJson = null;
      const specs = {};
      
      // Safely check and add each field (handle undefined/null)
      if (formData.specType && formData.specType.trim()) specs.Type = formData.specType.trim();
      if (formData.specStitches && formData.specStitches.trim()) specs.Stitches = formData.specStitches.trim();
      if (formData.specButtonholes && formData.specButtonholes.trim()) specs.Buttonholes = formData.specButtonholes.trim();
      if (formData.specStitchWidth && formData.specStitchWidth.trim()) specs['Stitch Width'] = formData.specStitchWidth.trim();
      if (formData.specStitchLength && formData.specStitchLength.trim()) specs['Stitch Length'] = formData.specStitchLength.trim();
      if (formData.specSpeed && formData.specSpeed.trim()) specs.Speed = formData.specSpeed.trim();
      if (formData.specWarranty && formData.specWarranty.trim()) specs.Warranty = formData.specWarranty.trim();
      
      if (Object.keys(specs).length > 0) {
        specificationsJson = JSON.stringify(specs);
        console.log('Specifications JSON being sent:', specificationsJson);
      } else {
        console.log('No specifications to save');
      }

      // Handle date conversion - datetime-local format is YYYY-MM-DDTHH:mm
      // datetime-local input is timezone-naive, send as-is with seconds appended
      // Backend will parse it as LocalDateTime (no timezone conversion needed)
      let priceStartDate = null;
      let priceEndDate = null;
      if (formData.priceStartDate && formData.priceStartDate.trim()) {
        try {
          // datetime-local format: "YYYY-MM-DDTHH:mm"
          // Append ":00" for seconds to match ISO format without timezone
          // This preserves the exact time entered by the user
          priceStartDate = formData.priceStartDate + ':00';
          
          console.log('Start date conversion:', {
            input: formData.priceStartDate,
            output: priceStartDate
          });
        } catch (e) {
          console.error('Invalid start date:', e);
        }
      }
      if (formData.priceEndDate && formData.priceEndDate.trim()) {
        try {
          // datetime-local format: "YYYY-MM-DDTHH:mm"
          // Append ":00" for seconds
          priceEndDate = formData.priceEndDate + ':00';
          
          console.log('End date conversion:', {
            input: formData.priceEndDate,
            output: priceEndDate
          });
        } catch (e) {
          console.error('Invalid end date:', e);
        }
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        scheduledPrice: formData.scheduledPrice && formData.scheduledPrice.trim() ? parseFloat(formData.scheduledPrice) : null,
        priceStartDate: priceStartDate,
        priceEndDate: priceEndDate,
        highlights: highlights,
        galleryImages: galleryImages,
        specificationsJson: specificationsJson, // Already a JSON string from JSON.stringify(specs)
        // Remove individual spec fields from the data sent to backend
        specType: undefined,
        specStitches: undefined,
        specButtonholes: undefined,
        specStitchWidth: undefined,
        specStitchLength: undefined,
        specSpeed: undefined,
        specWarranty: undefined,
      };
      
      // Clean up undefined fields
      Object.keys(productData).forEach(key => {
        if (productData[key] === undefined) {
          delete productData[key];
        }
      });

      if (product) {
        await api.updateProduct(product.id, productData);
      } else {
        await api.createProduct(productData);
      }

      onSuccess();
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="e.g., Usha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Slug <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(Used in product URL)</span>
              </label>
              <input
                type="text"
                name="brandSlug"
                value={formData.brandSlug}
                onChange={handleChange}
                placeholder="e.g., usha"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Product Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            {formData.mainImageUrl ? (
              <div className="relative">
                <img
                  src={formData.mainImageUrl}
                  alt="Main Product"
                  className="h-32 w-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mainImageUrl: '' })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="h-32 w-32 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload(e, 'main')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Main Image'}
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Image will be uploaded to Cloudinary
              </p>
            </div>
          </div>
          <input
            type="text"
            name="mainImageUrl"
            value={formData.mainImageUrl}
            onChange={handleChange}
            placeholder="Or paste main image URL directly"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
          />
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gallery Images (One URL per line, up to 4 images)
          </label>
          <textarea
            name="galleryImages"
            value={formData.galleryImages}
            onChange={handleChange}
            rows={4}
            placeholder="Paste image URLs, one per line:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg&#10;https://example.com/image4.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can upload images and paste URLs here, or use the upload buttons below
          </p>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[0, 1, 2, 3].map((index) => {
              const galleryUrls = formData.galleryImages.split('\n').filter(url => url.trim());
              const imageUrl = galleryUrls[index] || '';
              return (
                <div key={index} className="relative">
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index + 1}`}
                        className="h-20 w-full object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const urls = formData.galleryImages.split('\n').filter(url => url.trim());
                          urls[index] = '';
                          setFormData({ ...formData, galleryImages: urls.join('\n') });
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={galleryFileRefs[index]}
                    onChange={(e) => handleImageUpload(e, 'gallery', index)}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileRefs[index].current?.click()}
                    disabled={uploading}
                    className="mt-1 w-full text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Upload {index + 1}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legacy Image URL (for backward compatibility) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legacy Image URL (Optional - for backward compatibility)
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Or paste image URL directly"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
          />
        </div>

        {/* Price Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
            />
          </div>
        </div>

        {/* Stock Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-end space-x-4 flex-wrap">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">On Sale</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">New</span>
            </label>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlights (One per line)
          </label>
          <textarea
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            rows={6}
            placeholder="Enter highlights, one per line:&#10;110 Built-in Stitches&#10;Automatic Needle Threader&#10;7 One-Step Buttonholes&#10;LCD Display"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Each line will become a bullet point in the highlights section
          </p>
        </div>

        {/* Specifications */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <input
                type="text"
                name="specType"
                value={formData.specType}
                onChange={handleChange}
                placeholder="e.g., Mechanical, Computerized"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stitches
              </label>
              <input
                type="text"
                name="specStitches"
                value={formData.specStitches}
                onChange={handleChange}
                placeholder="e.g., 15, 110"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buttonholes
              </label>
              <input
                type="text"
                name="specButtonholes"
                value={formData.specButtonholes}
                onChange={handleChange}
                placeholder="e.g., 1 step automatic, 7 one-step"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stitch Width
              </label>
              <input
                type="text"
                name="specStitchWidth"
                value={formData.specStitchWidth}
                onChange={handleChange}
                placeholder="e.g., 5mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stitch Length
              </label>
              <input
                type="text"
                name="specStitchLength"
                value={formData.specStitchLength}
                onChange={handleChange}
                placeholder="e.g., 4mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed
              </label>
              <input
                type="text"
                name="specSpeed"
                value={formData.specSpeed}
                onChange={handleChange}
                placeholder="e.g., 800 stitches per minute"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty
              </label>
              <input
                type="text"
                name="specWarranty"
                value={formData.specWarranty}
                onChange={handleChange}
                placeholder="e.g., 1 year, 2 years"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Price Scheduling */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Price Scheduling</h3>
          <p className="text-sm text-gray-600 mb-4">
            Set a scheduled price that will be active between the start and end dates. After the end date, the price will revert to the normal price.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Price
              </label>
              <input
                type="number"
                name="scheduledPrice"
                value={formData.scheduledPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="e.g., 19999"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="priceStartDate"
                value={formData.priceStartDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="priceEndDate"
                value={formData.priceEndDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
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
            className="px-6 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

