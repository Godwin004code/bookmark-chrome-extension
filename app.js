document.addEventListener('DOMContentLoaded', () => {
    const bookmarksDiv = document.getElementById('bookmarks');

    if (chrome && chrome.bookmarks) {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            displayBookmarks(bookmarkTreeNodes, bookmarksDiv);
        });
    } else {
        console.error('chrome.bookmarks API is not available');
    }

    function displayBookmarks(nodes, parentElement) {
        nodes.forEach(node => {
            if (node.url) {
                const bookmarkElement = document.createElement('div');
                bookmarkElement.className = 'bookmark';

                // Create a static link preview using the favicon
                const linkPreviewElement = createStaticLinkPreview(node.title, node.url);
                bookmarkElement.appendChild(linkPreviewElement);
                parentElement.appendChild(bookmarkElement);
            } else if (node.children) {
                const folderElement = document.createElement('div');
                folderElement.textContent = node.title;
                parentElement.appendChild(folderElement);
                displayBookmarks(node.children, folderElement);
            }
        });
    }

    function createStaticLinkPreview(title, url) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'link-preview';

        // Get the favicon from the URL
        const faviconUrl = new URL(url).origin + '/favicon.ico'; 

        const image = document.createElement('img');
        image.src = faviconUrl;  // Set the favicon URL
        image.onerror = function() {
            image.src = './icons/icon48.png'; // Replace with a default image URL
        };
        
        image.alt = title; // Set alt text for the image

        const titleElement = document.createElement('h2');
        titleElement.textContent = title || 'No Title';

        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.target = "_blank";
        linkElement.appendChild(image);
        linkElement.appendChild(titleElement);

        previewDiv.appendChild(linkElement);
        return previewDiv;
    }
});
