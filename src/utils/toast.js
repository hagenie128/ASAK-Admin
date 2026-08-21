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

// 여러 토스트가 동시에 떠 있을 수 있어서(예: 영수증 여러 건을 연달아 출력) 개별 토스트를
// fixed로 두지 않고, 화면 우하단에 고정된 컨테이너 하나 안에 쌓는다.
function getContainer() {
  let container = document.querySelector(".admin-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "admin-toast-container";
    document.body.appendChild(container);
  }
  return container;
}

// sticky: true면 자동으로 사라지지 않는다 (update()로 상태가 바뀔 때만 처리).
// 반환값의 update/close로 "요청 중 → 완료/실패"처럼 같은 토스트를 그 자리에서 갱신할 수 있다.
function show(title, tone = "success", message, { sticky = false } = {}) {
  const el = document.createElement("div");
  el.setAttribute("role", "status");

  const icon = document.createElement("span");
  icon.className = "admin-toast__icon";
  icon.setAttribute("aria-hidden", "true");

  const text = document.createElement("div");
  text.className = "admin-toast__text";

  const titleEl = document.createElement("p");
  titleEl.className = "admin-toast__title";
  text.appendChild(titleEl);

  const messageEl = document.createElement("p");
  messageEl.className = "admin-toast__message";
  text.appendChild(messageEl);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "admin-toast__close";
  close.setAttribute("aria-label", "닫기");
  close.textContent = "✕";

  let timer = null;

  const remove = () => {
    el.remove();
    if (timer) window.clearTimeout(timer);
  };
  close.addEventListener("click", remove);

  el.append(icon, text, close);
  getContainer().appendChild(el);

  function render(nextTitle, nextTone, nextMessage) {
    const isLong = Boolean(nextMessage);
    el.className = `admin-toast admin-toast--${nextTone}${isLong ? " admin-toast--long" : ""}`;
    icon.replaceChildren(createToastIcon(nextTone));
    titleEl.textContent = nextTitle;
    messageEl.textContent = nextMessage ?? "";
    messageEl.style.display = isLong ? "" : "none";
  }

  function scheduleAutoDismiss() {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(remove, DISMISS_MS);
  }

  render(title, tone, message);
  if (!sticky) scheduleAutoDismiss();

  return {
    // "요청 중" -> "출력 중"처럼 loading에서 loading으로 갱신할 때도 여기로 오므로,
    // 다음 tone이 loading이면 계속 sticky 상태를 유지하고, success/error/warning/info처럼
    // 최종 상태로 바뀔 때만 자동소멸 타이머를 건다.
    update(nextTitle, nextTone, nextMessage) {
      render(nextTitle, nextTone, nextMessage);
      if (nextTone === "loading") {
        if (timer) {
          window.clearTimeout(timer);
          timer = null;
        }
      } else {
        scheduleAutoDismiss();
      }
    },
    close: remove,
  };
}

export const toast = {
  success: (title, message) => show(title, "success", message),
  error: (title, message) => show(title, "error", message),
  warning: (title, message) => show(title, "warning", message),
  info: (title, message) => show(title, "info", message),
  // 완료/실패를 모를 때 쓰는 진행 중 토스트. 자동으로 안 사라지므로 반환된 handle.update(...)로
  // 직접 마무리해줘야 한다 (안 그러면 화면에 계속 남아있음).
  loading: (title, message) => show(title, "loading", message, { sticky: true }),
};
