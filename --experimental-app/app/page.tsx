// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">✈️ 여행 기록 서비스</h1>
      <p className="text-lg text-gray-600 mb-6">
        나만의 여행을 기록하고, 추억을 공유하세요.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          로그인
        </a>
        <a
          href="/signup"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          회원가입
        </a>
      </div>
    </main>
  );
}
