// 학습용: UUID를 만드는 함수. crypto.randomUUID()를 직접 쓰지 말고 여기만 호출한다.
//
// crypto.randomUUID()는 "secure context"(HTTPS 또는 localhost)에서만 제공된다.
// PC에서 http://localhost:5173 으로 열면 localhost가 예외로 secure context 취급이라 잘 되지만,
// 태블릿에서 http://192.168.x.x:5173 처럼 LAN IP + HTTP로 열면 secure context가 아니라서
// crypto.randomUUID가 undefined가 되고 "crypto.randomUUID is not a function"이 난다.
// 그래서 없을 때는 Math.random 기반으로 v4 형식 문자열을 직접 만든다.
//
// 주의: fallback은 암호학적으로 안전한 난수가 아니다. 중복 요청 식별용 id에만 쓰고,
// 보안 토큰(세션·인증 등)에는 쓰지 않는다.

export function createUuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;

    return value.toString(16);
  });
}
