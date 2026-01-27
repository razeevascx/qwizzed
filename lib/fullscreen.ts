/**
 * Utility to toggle native browser fullscreen on a target element
 * @param element The HTMLElement to go fullscreen
 */
export const toggleFullscreen = async (element: HTMLElement | null) => {
  if (!element) return;

  try {
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
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
