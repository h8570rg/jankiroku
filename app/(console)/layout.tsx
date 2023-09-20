export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="relative min-h-screen px-4 py-5">{children}</main>
    </div>
  );
}
