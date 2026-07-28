import axios from "axios";

/*
 * API 공통 클라이언트
 * 서버 응답 envelope({ success, status, code, message, data })는
 * 이 파일에서 한 번만 해제한다.
 */

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    Accept: "application/json",
  },
});

// 서버 공통 응답 envelope 해제
export function unwrapResponse(response) {
  const body = response.data;

  if (!body?.success) {
    const error = new Error(body?.message ?? "API request failed");
    error.code = body?.code;
    error.status = body?.status ?? response.status;
    throw error;
  }

  return body.data;
}

// 성공 응답은 각 화면에 body.data만 전달
apiClient.interceptors.response.use(
  (response) => unwrapResponse(response),
  (error) => Promise.reject(error),
);
