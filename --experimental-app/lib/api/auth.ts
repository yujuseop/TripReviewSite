// lib/api/auth.ts
export async function signupApi({
  email,
  password,
  nickname,
}: {
  email: string;
  password: string;
  nickname: string;
}) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nickname }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "회원가입 실패");
  }

  return res.json(); // { user: ... }
}
