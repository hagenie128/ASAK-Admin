# 태블릿에서 UUID 생성 실패 — secure context 문제

- 작성일: 2026-08-21
- 증상: PC에서는 정상인데 **태블릿에서만** UUID 생성이 실패
- 상태: **수정 적용 완료** (`src/utils/uuid.js` 신규, `src/api/ordersApi.js` 교체)

## 1. 증상

같은 코드인데 접속 주소에 따라 동작이 갈렸다.

```text
PC     http://localhost:5173      → crypto.randomUUID() 정상
태블릿  http://192.168.x.x:5173    → crypto.randomUUID() 실패
```

브라우저에 따라 다음 중 하나가 나온다.

```text
TypeError: crypto.randomUUID is not a function
```

또는 `crypto.randomUUID`가 `undefined`.

## 2. 원인 — secure context

`crypto.randomUUID()`는 **secure context에서만 제공되는 API**다. secure context로 인정되는 것은
크게 두 가지다.

- `https://` 로 접속한 페이지
- `http://localhost` / `http://127.0.0.1` (브라우저가 개발 편의를 위해 **예외적으로** 허용)

PC에서 `http://localhost:5173`으로 여는 건 두 번째 예외에 해당해서 잘 동작한다.
반면 태블릿에서 `http://192.168.x.x:5173`으로 열면 **LAN IP + 평문 HTTP**라 secure context가
아니다. 브라우저가 이 상황에서 `crypto.randomUUID`를 제공하지 않는다.

> 요약: 코드가 바뀐 게 아니라 **접속 주소가 바뀌면서 브라우저가 API 하나를 빼버린 것**이다.
> "localhost에서는 되고 LAN IP HTTP에서만 안 된다"는 패턴이 이 문제의 전형적인 증상이다.

## 3. 적용한 해결

UUID 생성을 유틸 하나로 감싸고 fallback을 뒀다.

**`src/utils/uuid.js` (신규)**

```js
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
```

**`src/api/ordersApi.js` (교체)**

```diff
+import { createUuid } from "../utils/uuid.js";

 printReceipt: (order) =>
   apiClient.post(API_ENDPOINTS.printReceipt(order.orderId), {
     eventType: "PRINT_RECEIPT_TEXT",
     payload: buildReceiptText(order),
-    requestId: crypto.randomUUID(),
+    requestId: createUuid(),
   }),
```

### 영향 범위

`crypto.randomUUID()` 직접 호출은 **이 한 곳이 전부**였다(영수증 출력 요청의 `requestId`).
`ASAK-Kiosk`에는 직접 호출이 없다.

`navigator.clipboard`, `getUserMedia`, `serviceWorker`, `crypto.subtle` 등 **다른 secure
context 전용 API는 두 프로젝트 모두 사용하지 않는다**. 따라서 태블릿에서 같은 이유로 깨질
곳은 더 없다.

## 4. 주의 — fallback은 보안용이 아니다

fallback은 `Math.random()` 기반이라 **암호학적으로 안전한 난수가 아니다.**

이번 `requestId`는 중복 요청 식별용이라 이 fallback으로 충분하다. 하지만 앞으로 세션 토큰,
인증 키, 추측 불가능해야 하는 식별자에는 쓰면 안 된다. 그런 값이 필요해지면 서버에서 발급받는다.

> 참고: `crypto.getRandomValues()`는 `crypto.randomUUID()`와 달리 **non-secure context에서도
> 동작한다.** fallback 품질을 높이고 싶으면 `getRandomValues` → `Math.random` 2단 fallback으로
> 바꿀 수 있다. 현재 용도에는 불필요해서 넣지 않았다.

## 5. 대안 (참고)

### uuid 패키지

`ASAK-Kiosk`는 이미 `uuid` 패키지를 쓰고 있다(`package.json`의 `"uuid": "^14.0.1"`,
`MenuDetailPage.jsx`에서 `uuidv4()`로 `cartItemId` 생성). 이 패키지는 내부에 동일한 fallback이
있어서 `http://192.168...`에서도 문제없이 동작한다.

```bash
npm install uuid
```

```js
import { v4 as uuidv4 } from "uuid";

const requestId = uuidv4();
```

**Admin에는 적용하지 않았다.** 사용처가 한 곳뿐이라 의존성을 새로 추가하는 것보다 유틸
파일 하나가 가볍고, 시연을 앞두고 `package-lock.json`을 건드리지 않는 편이 안전하다고 판단했다.

> 두 프로젝트가 서로 다른 방식(Kiosk = uuid 패키지, Admin = 자체 유틸)을 쓰게 된 점은 알고
> 있다. 나중에 정리한다면 Admin도 `uuid` 패키지로 통일하는 쪽이 일관성 면에서 낫다.

### 근본 해결 — HTTPS로 서빙

secure context 문제 자체를 없애려면 개발 서버를 HTTPS로 띄우면 된다.
`vite.config.js`에 `server.https` 설정 + `mkcert` 등으로 로컬 인증서를 만드는 방식이다.

다만 태블릿에 인증서를 신뢰시키는 과정이 추가로 필요해서 시연 준비 비용이 크다.
지금은 fallback으로 충분하다.

## 6. 재발 방지

- **UUID가 필요하면 `crypto.randomUUID()`를 직접 부르지 말고 `createUuid()`를 쓴다.**
  `src/utils/uuid.js` 상단 주석에도 같은 내용을 적어 뒀다.
- 새 브라우저 API를 쓸 때는 MDN 문서에 **"Secure context: This feature is available only in
  secure contexts"** 배너가 있는지 확인한다. 있으면 태블릿(LAN IP + HTTP)에서 깨진다.
- **PC의 localhost에서만 테스트하면 이 문제를 절대 못 잡는다.** 시연에 쓸 기기와 주소로
  한 번은 직접 확인한다.
