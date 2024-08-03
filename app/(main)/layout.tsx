import Navbar from "./(components)/Navbar";
// import { getUser } from "./actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // await getUser(); // TODO: パフォーマンス検証中。うまくいったらコンテキスト流したい。
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-5">{children}</main>
    </div>
  );
}
