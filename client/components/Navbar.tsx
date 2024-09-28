import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full bg-indigo-900 text-white py-4">
      <div className="w-full flex justify-between items-center px-12">
        <Link
          href="/"
          className="text-2xl font-bold hover:opacity-75 transition-opacity duration-300"
        >
          Gaming Device Share
        </Link>
        <div className="flex space-x-3">
          <Link
            href="/auth/signin"
            className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
          >
            ログイン
          </Link>
          <Link
            href="/auth/signup"
            className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
          >
            新規登録
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
