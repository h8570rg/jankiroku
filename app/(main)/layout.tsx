import Navbar from "./(components)/Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-5">{children}</main>
    </div>
  );
}
