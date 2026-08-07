# 01. 개발 환경과 온보딩

## 필수 도구

- Node.js LTS (20 이상 권장)
- npm 10 이상
- Git
- VS Code 권장 확장: ESLint, EditorConfig, GitLens

## 최초 실행

```bash
cp .env.example .env
npm install
npm run dev
```

`.env`는 개인 개발 환경 전용입니다. 토큰, 비밀번호, 실제 운영 주소는 커밋하지 않습니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

화면별 mock/실API는 `src/STRUCTURE_GUIDE.md` 표를 본다. (`VITE_USE_MOCK` 없음)
## 매일 시작/종료 루틴

1. 시작: `git pull --rebase origin main` 후 `npm run lint`를 실행한다.
2. 작업: 한 브랜치에는 한 화면 또는 한 기능만 넣는다.
3. 종료: `npm run lint && npm run build`를 실행하고, 변경 API와 다음 할 일을 기록한다.

## 자주 발생하는 문제

| 증상 | 확인 방법 | 해결 |
| --- | --- | --- |
| `vite` 명령을 찾지 못함 | `node_modules` 존재 여부 | `npm install` 실행 |
| API가 401/403 | `.env` 주소와 인증 헤더 | 로그인/권한 처리와 서버 CORS 확인 |
| 새로고침 시 404 | 배포 환경에서만 발생 | 서버의 SPA fallback을 `index.html`로 설정 |
| 화면이 이전 상태 | 개발 서버 캐시 | 서버 재시작 후 브라우저 강력 새로고침 |
