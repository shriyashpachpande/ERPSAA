/**
 * Centralized helper to resolve relative file paths from the backend
 * to full, accessible URLs for the frontend.
 * 
 * It handles:
 * 1. Already full URLs (starting with http)
 * 2. Relative paths (starting with /uploads)
 * 3. Fallback to a default if no path is provided
 */

export const getFileUrl = (pathOrUrl) => {
    if (!pathOrUrl) return null;
    
    // If it's already a full URL, return as is
    if (pathOrUrl.startsWith('http')) {
        return pathOrUrl;
    }
    
    // Ensure path starts with a slash
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    
    // Since we've added a Vite proxy for /uploads, we can return the relative path
    // and Vite will proxy it to the backend (http://localhost:5000/uploads/...)
    return cleanPath;
};

export const getDownloadUrl = (pathOrUrl) => {
    const url = getFileUrl(pathOrUrl);
    // In some cases we might want to force download, but for browser preview/download
    // a standard URL works fine.
    return url;
};
