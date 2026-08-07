import { useParams } from "react-router-dom";

const screenLabels = {
  live: "실시간 주문",
  orders: "주문 관리",
  soldout: "품절 관리",
  login: "로그인",
  menu: "메뉴 관리",
  payment: "결제 수단",
  sales: "매출",
  dashboard: "대시보드",
};

const copy = {
  loading: ["불러오는 중입니다", "데이터를 조회하는 상태의 정적 UI입니다."],
  empty: ["표시할 데이터가 없습니다", "조건에 맞는 항목이 없을 때의 UI입니다."],
  error: ["화면을 불러오지 못했습니다", "재시도 로직은 기능 구현 시 연결합니다."],
  confirm: ["변경 사항을 확인해주세요", "확인과 취소는 정적 버튼입니다."],
  progress: ["저장 중입니다", "요청 중 입력을 잠그는 상태의 UI입니다."],
  success: ["변경 사항이 반영되었습니다", "정적 성공 안내 상태입니다."],
  selection: ["변경된 상태 미리보기", "선택값은 실제 데이터 연결 후 표시됩니다."],
  info: ["상태 화면 미리보기", "Figma 상태별 화면을 확인하는 개발용 UI입니다."],
};

function getTone(state) {
  if (/loading|saving|submitting|retry/i.test(state)) return "progress";
  if (/empty/i.test(state)) return "empty";
  if (/error|failure|unauthorized/i.test(state)) return "error";
  if (/confirm/i.test(state)) return "confirm";
  if (/success|toast|changed|notification/i.test(state)) return "success";
  if (/detail|selected|disabled|filter/i.test(state)) return "selection";
  return "info";
}

export default function UiStatePreviewPage() {
  const { screen = "live", state = "loading" } = useParams();
  const tone = getTone(state);
  const [title, description] = copy[tone];

  return (
    <main className="admin-state-preview">
      <header><strong>ASAK</strong><span>Admin UI Preview</span></header>
      <section>
        <p>{screenLabels[screen] ?? screen}</p>
        <article className={`admin-state-card admin-state-card--${tone}`}>
          <i aria-hidden="true" />
          <h1>{title}</h1><p>{description}</p><code>{state}</code>
          {tone === "confirm" && <div><button disabled>취소</button><button disabled>확인</button></div>}
        </article>
      </section>
    </main>
  );
}
