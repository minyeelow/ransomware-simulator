/**
 * Local Directory Pointer Helper
 * Opens the native OS directory chooser (Finder on Mac, Explorer on Windows)
 * purely to point to the local folder without uploading or transferring any files.
 */

export async function openLocalDirectoryPicker(fallbackInputEl) {
  // Method 1: Modern File System Access API (Chrome, Edge, Chromium)
  if (typeof window.showDirectoryPicker === 'function') {
    try {
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      if (dirHandle && dirHandle.name) {
        // Construct clean path pointer (browser privacy shields full absolute path)
        const pathPointer = `/${dirHandle.name}`;
        return {
          name: dirHandle.name,
          path: pathPointer,
          isLinked: true,
          handle: dirHandle
        };
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User intentionally cancelled the dialog
        return null;
      }
      console.warn('showDirectoryPicker failed, trying fallback input:', err);
    }
  }

  // Method 2: Standard HTML5 webkitdirectory input fallback (Safari, Firefox, etc.)
  if (fallbackInputEl) {
    return new Promise((resolve) => {
      const handleChange = (e) => {
        fallbackInputEl.removeEventListener('change', handleChange);
        const files = e.target.files;
        if (files && files.length > 0) {
          const first = files[0];
          let folderName = 'SelectedFolder';
          if (first.webkitRelativePath) {
            folderName = first.webkitRelativePath.split('/')[0];
          }
          resolve({
            name: folderName,
            path: `/${folderName}`,
            isLinked: true
          });
        } else {
          resolve(null);
        }
      };

      fallbackInputEl.addEventListener('change', handleChange, { once: true });
      fallbackInputEl.click();
    });
  }

  return null;
}
