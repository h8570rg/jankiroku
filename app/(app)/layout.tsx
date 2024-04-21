import Navbar from "./Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 pb-5">{children}</main>
    </div>
  );
}
