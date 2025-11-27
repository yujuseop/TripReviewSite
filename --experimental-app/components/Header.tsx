import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-700 shadow-md w-full ">
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center justify-center text-white"
        >
          TripView
        </Link>
      </div>
    </header>
  );
}
