const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="flex-grow container p-12 text-center bg-white shadow-md rounded-md mt-4 max-w-8xl">
        <h2 className="text-7xl font-bold text-indigo-600 mb-16 leading-tight">
          Gaming Device Share <span className="text-black">とは</span>
        </h2>
        <p className="text-gray-800 text-5xl leading-relaxed">
          自分のおすすめのゲーミングデバイスを投稿したり、
          <br />
          他人のおすすめしているゲーミングデバイスを閲覧する事ができます。
          <br />
          またプロフィールには、現在使用しているゲーミングデバイスを登録できます。
          <br />
          プロフィールは他の人も閲覧可能です。
        </p>
      </main>
    </div>
  );
};

export default Home;
