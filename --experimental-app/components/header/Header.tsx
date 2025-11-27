import Link from "next/link";
import HeaderAuthButtons from "./HeaderAuthButtons";

export default function Header() {
  return (
    <header className="bg-gray-700 shadow-md w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-gray-200"
          >
            TripView
          </Link>
          <HeaderAuthButtons />
        </div>
      </div>
    </header>
  );
}
