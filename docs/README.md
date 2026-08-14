# ASAK Admin 문서 목차

| 문서 | 읽는 시점 | 핵심 내용 |
| --- | --- | --- |
| [온보딩](onboarding-2026-07-14.md) | 프로젝트 시작 전 | 설치, 실행, 환경변수, 문제 해결 |
| [Android PWA 전체화면](../../ASAK/docs/operations/setup/android-pwa-fullscreen.md) | 태블릿 시연 전 | Admin·Kiosk 설치형 실행·fullscreen |
| [아키텍처](architecture-2026-07-14.md) | 기능 설계 전 | 폴더 구조, 상태·API·권한 책임 |
| [개발 가이드](development-guide-2026-07-14.md) | 화면 구현 시 | 컴포넌트, 라우트, 상태, UI 규칙 |
| [구조 지도](../src/STRUCTURE_GUIDE.md) | 파일 위치를 찾을 때 | 짧은 라우트·폴더 지도 |
| [Mock 필드 사전](../public/mocks/README.md) | 화면 바인딩 시 | repository getter · JSON 필드 |
| [Git 운영](git-workflow-2026-07-14.md) | 브랜치/PR 전 | 브랜치, 커밋, PR, 충돌 대응 |
| [API 연동](api-integration-2026-07-14.md) | 서버 연결 시 | 응답 envelope, 인증, 오류 처리 |
| [Figma UI 넘김](figma-ui-handoff-2026-07-18.md) | 디자인 대조 시 | 화면·노드 매핑 기록 |
| [시각 패리티 로그](figma-visual-parity-log-2026-07-18.md) | 시안 QA 이력 | 캡처·대조 메모 |

문서와 구현이 충돌하면 API 계약과 운영 정책을 먼저 확인하고, 결정 사항을 해당 문서에 갱신합니다.

API 번호(API-007~024)·실연동/mock 현황은 [루트 README](../README.md)와 [`ASAK-back/IMPLEMENTATION_PLAN.md`](../../ASAK-back/IMPLEMENTATION_PLAN.md) §4를 본다.

화면 상태는 [06-C Admin](https://www.figma.com/design/yHhvn5RKjBd91U8BJUQz7F/ASAK-%E2%80%94-Design-System---Product-UI-0718?node-id=134-10606), QA 범위는 [07-C Matrix](https://www.figma.com/design/yHhvn5RKjBd91U8BJUQz7F/ASAK-%E2%80%94-Design-System---Product-UI-0718?node-id=190-2), API 응답 형태는 [중앙 API 가이드](../../ASAK/docs/implementation_guide/04-api-db-implementation.md)를 기준으로 확인합니다.

> **참고:** 루트 `TODO.md` / `IMPLEMENTATION_PLAN.md` 및 매출 체크리스트·TODO 트리 등 **구현 실행용 문서**는 정리·삭제했다. 온보딩·아키텍처·Mock 사전과 위 표를 본다.
