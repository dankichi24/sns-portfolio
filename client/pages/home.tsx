import Link from "next/link";

const Home = () => {
  return (
    <div className="home-page">
      <h1 className="text-center text-3xl font-bold mb-4">ホーム画面</h1>

      {/* 投稿ボタン */}
      <div className="flex justify-end mb-4">
        <Link href="/post/create">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Share
          </button>
        </Link>
      </div>

      {/* 投稿リストのコンテンツ */}
      <div className="post-list">
        <ul>
          <li className="bg-white p-4 mb-4 rounded shadow-md">
            <div>name</div>
            <div>2</div>
          </li>
          <li className="bg-white p-4 mb-4 rounded shadow-md">
            <div>name</div>
            <div>4</div>
          </li>
          <li className="bg-white p-4 mb-4 rounded shadow-md">
            <div>me</div>
            <div>0</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
