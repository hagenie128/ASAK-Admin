// Figma Shared/Toast — dismissDuration 4000ms, Admin 하단 여백 12px
// CSS: .admin-toast* (styles/admin/shared.css)

const DISMISS_MS = 4000;

const TOAST_ICON_PATHS = {
  success: '<circle cx="12" cy="12" r="10"/><path d="m8 12 2.5 2.5L16 9"/>',
  error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  warning: '<path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  loading: '<circle cx="12" cy="12" r="9" class="admin-toast__spinner-track"/><path d="M21 12a9 9 0 0 0-9-9"/>',
};

function createToastIcon(tone) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.innerHTML = TOAST_ICON_PATHS[tone] ?? TOAST_ICON_PATHS.info;
  return svg;
}

function show(title, tone = "success", message) {
  const el = document.createElement("div");
  const isLong = Boolean(message);
  el.className = `admin-toast admin-toast--${tone}${isLong ? " admin-toast--long" : ""}`;
  el.setAttribute("role", "status");

  const icon = document.createElement("span");
  icon.className = "admin-toast__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.appendChild(createToastIcon(tone));

  const text = document.createElement("div");
  text.className = "admin-toast__text";

  const titleEl = document.createElement("p");
  titleEl.className = "admin-toast__title";
  titleEl.textContent = title;
  text.appendChild(titleEl);

  if (isLong) {
    const messageEl = document.createElement("p");
    messageEl.className = "admin-toast__message";
    messageEl.textContent = message;
    text.appendChild(messageEl);
  }

  const close = document.createElement("button");
  close.type = "button";
  close.className = "admin-toast__close";
  close.setAttribute("aria-label", "닫기");
  close.textContent = "✕";

  const remove = () => {
    el.remove();
    window.clearTimeout(timer);
  };
  close.addEventListener("click", remove);

  el.append(icon, text, close);
  document.body.appendChild(el);
  const timer = window.setTimeout(remove, DISMISS_MS);
}

export const toast = {
  success: (title, message) => show(title, "success", message),
  error: (title, message) => show(title, "error", message),
  warning: (title, message) => show(title, "warning", message),
  info: (title, message) => show(title, "info", message),
  loading: (title, message) => show(title, "loading", message),
};
