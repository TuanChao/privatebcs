import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html Raw HTML string
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Configure DOMPurify with safe settings
  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i
  };
  
  return DOMPurify.sanitize(html, config);
};

/**
 * Extract plain text from HTML safely
 * @param html HTML string
 * @param maxLength Maximum length of returned text
 * @returns Plain text string
 */
export const extractTextFromHtml = (html: string, maxLength = 80): string => {
  if (!html) return '';
  
  // First sanitize the HTML
  const sanitized = sanitizeHtml(html);
  
  // Create a temporary div to extract text content safely
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitized;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};