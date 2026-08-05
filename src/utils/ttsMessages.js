const DefaultTtsOptions = { lang: "ko-KR", rate: 0.95, pitch: 1, volume: 1 };

export const isTtsSupported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

export const speak = (text, options = {}) =>
  new Promise((resolve, reject) => {
    if (!text) {
      reject(new Error("TTS_EMPTY_TEXT"));
      return;
    }
    if (!isTtsSupported()) {
      reject(new Error("TTS_NOT_SUPPORTED"));
      return;
    }
    const config = { ...DefaultTtsOptions, ...options };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.lang;
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(e.error || "TTS_PLAYBACK_FAILED"));
    window.speechSynthesis.speak(utterance);
  });

export const createOrderCompletedMessage = (orderNo) =>
  `주문번호 ${orderNo}번, 주문이 완료되었습니다.`;
