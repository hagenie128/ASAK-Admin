const DefaultTtsOptions = { lang: "ko-KR", rate: 0.95, pitch: 1, volume: 1 };

export const isTtsSupported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

let cachedVoice = null;

function pickKoreanVoice() {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  const koreanVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith("ko"));

  // 선호 순서: Google > Microsoft Neural(Heami/SunHi/InJoon) > 그 외 한국어 보이스
  cachedVoice =
    koreanVoices.find((v) => /google/i.test(v.name)) ||
    koreanVoices.find((v) => /heami|sunhi|injoon|neural/i.test(v.name)) ||
    koreanVoices[0] ||
    null;

  return cachedVoice;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickKoreanVoice();
  };
}

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
    const voice = pickKoreanVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(e.error || "TTS_PLAYBACK_FAILED"));
    window.speechSynthesis.speak(utterance);
  });

const extractLastDigits = (orderNo, count = 4) =>
  String(orderNo ?? "").replace(/\D/g, "").slice(-count);

const DIGIT_WORDS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const UNIT_WORDS = ["", "십", "백", "천"];

// 숫자를 사이노-한자어로 읽어준다 (예: 1234 -> "천이백삼십사").
// 브라우저 TTS에 "1234"를 그대로 넘기면 엔진이 자체 판단으로 고유어(서른넷)와
// 한자어(천이백)를 섞어 읽는 경우가 있어, 미리 한글 단어로 바꿔 그대로 읽게 한다.
function toSinoKoreanNumber(num) {
  if (num === 0) return "영";

  const str = String(num);
  let result = "";

  for (let i = 0; i < str.length; i += 1) {
    const digit = Number(str[i]);
    const unitIndex = str.length - i - 1;

    if (digit === 0) continue;

    result += digit === 1 && unitIndex > 0 ? UNIT_WORDS[unitIndex] : DIGIT_WORDS[digit] + UNIT_WORDS[unitIndex];
  }

  return result;
}

export const createOrderCompletedMessage = (orderNo) => {
  const spokenNumber = toSinoKoreanNumber(Number(extractLastDigits(orderNo)) || 0);
  return `주문번호 ${spokenNumber}번, 주문이 완료되었습니다.`;
};
