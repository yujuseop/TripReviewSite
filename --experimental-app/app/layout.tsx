import "./globals.css";
import { ReactQueryProvider } from "@/providers/query_provider";
import { SupabaseAuthProvider } from "@/providers/supabase_auth_provider";

export const metadata = {
  title: "My App",
  description: "Next.js App Router + Supabase Auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <SupabaseAuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
