/**
 * Chrome 등: 사용자 제스처(클릭/터치) 안에서만 requestFullscreen 가능.
 * 실패해도 앱 흐름은 막지 않는다 (지원 안 함·거부·이미 전체화면 등).
 */
export async function requestAppFullscreen(element = document.documentElement, orientation = "landscape") {
  if (typeof document === "undefined") return false;
  if (document.fullscreenElement) return true;

  const target = element ?? document.documentElement;
  const request =
    target.requestFullscreen?.bind(target) ||
    target.webkitRequestFullscreen?.bind(target) ||
    target.msRequestFullscreen?.bind(target);

  if (!request) return false;

  try {
    await request();
    await window.screen.orientation?.lock?.(orientation);
    return true;
  } catch {
    return false;
  }
}
