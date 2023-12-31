import Link from "next/link";

// bottom navigation component
export function BottomNavigation() {
  return (
    <footer className="fixed bottom-0 w-full border-t border-gray-300 bg-white">
      <nav className="flex justify-around">
        <Link
          className="flex w-full flex-col items-center justify-center py-2 text-tiny uppercase text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          href="/matches"
        >
          <svg
            className="mb-1 h-5 w-5 fill-current text-gray-400"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 14h9l-3 8 11-10h-9l3-10z"></path>
          </svg>
          <span>Games</span>
        </Link>
        <Link
          className="flex w-full flex-col items-center justify-center py-2 text-tiny uppercase text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          href="#"
        >
          <svg
            className="mb-1 h-5 w-5 fill-current text-gray-400"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 14h9l-3 8 11-10h-9l3-10z"></path>
          </svg>
          <span>Search</span>
        </Link>
        <Link
          className="flex w-full flex-col items-center justify-center py-2 text-tiny uppercase text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          href="#"
        >
          <svg
            className="mb-1 h-5 w-5 fill-current text-gray-400"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 14h9l-3 8 11-10h-9l3-10z"></path>
          </svg>
          <span>Notifications</span>
        </Link>
        <Link
          className="flex w-full flex-col items-center justify-center py-2 text-tiny uppercase text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          href="#"
        >
          <svg
            className="mb-1 h-5 w-5 fill-current text-gray-400"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 14h9l-3 8 11-10h-9l3-10z"></path>
          </svg>
          <span>Messages</span>
        </Link>
      </nav>
    </footer>
  );
}
