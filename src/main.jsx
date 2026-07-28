import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AdminApp from "./apps/AdminApp.jsx";

// Application composition is kept here: router and the root admin app.
// CSS는 Kiosk와 같이 AdminApp에서 tokens → reset → global → commonStyle 순으로 로드.
// Feature-level state and API calls must live below src/apps and src/api instead.
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminApp />
  </BrowserRouter>,
);
