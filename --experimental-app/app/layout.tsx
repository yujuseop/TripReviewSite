import "./globals.css";
import { ReactQueryProvider } from "@/providers/query_provider";
import { SupabaseAuthProvider } from "@/providers/supabase_auth_provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TripView",
  description: "여행지를 기록하고 리뷰를 남길 수 있는 플랫폼",
  icons: {
    icon: "/favicon.png",
  },
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
