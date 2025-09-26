// app/layout.tsx
import "./globals.css"; // Tailwind 엔트리 CSS
import { ReactQueryProvider } from "@/providers/query_provider";
import { AuthSessionProvider } from "@/providers/session_provider";

export const metadata = {
  title: "My App",
  description: "Next.js + Supabase + React Query",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-black">
        <AuthSessionProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
