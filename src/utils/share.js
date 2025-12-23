// Share utility functions
export const shareProduct = (product, platform = 'native', onMessage = null) => {
  const url = window.location.href;
  const text = `Check out ${product.name} - ${product.brand || ''} at ₹${product.price || 'N/A'}`;
  const title = product.name;

  if (platform === 'native' && navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url,
    }).catch((error) => {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard
      copyToClipboard(url, onMessage);
    });
  } else if (platform === 'facebook') {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  } else if (platform === 'twitter') {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  } else if (platform === 'linkedin') {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  } else if (platform === 'pinterest') {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}&media=${encodeURIComponent(product.image || product.images?.[0] || '')}`;
    window.open(pinterestUrl, '_blank', 'width=600,height=400');
  } else {
    // Fallback to copying to clipboard
    copyToClipboard(url, onMessage);
  }
};

export const shareBlogPost = (post, platform = 'native', onMessage = null) => {
  const url = window.location.href;
  const text = post.excerpt || post.title;
  const title = post.title;

  if (platform === 'native' && navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url,
    }).catch((error) => {
      console.error('Error sharing:', error);
      copyToClipboard(url, onMessage);
    });
  } else if (platform === 'facebook') {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  } else if (platform === 'twitter') {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  } else if (platform === 'linkedin') {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  } else {
    copyToClipboard(url, onMessage);
  }
};

const copyToClipboard = (text, onMessage = null) => {
  navigator.clipboard.writeText(text).then(() => {
    if (onMessage) {
      onMessage('Link copied to clipboard!', 'success');
    }
  }).catch((error) => {
    console.error('Error copying to clipboard:', error);
    if (onMessage) {
      onMessage('Failed to copy link. Please copy manually: ' + text, 'error');
    }
  });
};

