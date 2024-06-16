import Navbar from "./(components)/Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="px-4 pb-5">{children}</main>
    </div>
  );
}
