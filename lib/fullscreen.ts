/**
 * Utility to toggle native browser fullscreen on a target element
 * @param element The HTMLElement to go fullscreen
 */
export const toggleFullscreen = async (element: HTMLElement | null) => {
  if (!element) return;

  try {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.error("Error toggling fullscreen:", err);
  }
};

/**
 * Checks if a specific element or its descendants are currently in fullscreen
 */
export const isElementFullscreen = (element: HTMLElement | null) => {
  if (!element || !document.fullscreenElement) return false;
  return document.fullscreenElement === element || element.contains(document.fullscreenElement);
};
