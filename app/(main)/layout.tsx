import dynamic from "next/dynamic";
import Navbar from "./(components)/Navbar";

const ReleaseNotesModal = dynamic(
  () => import("./(components)/ReleaseNotesModal"),
  { ssr: false },
);

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <main className="flex-1 px-4">{children}</main>
      <ReleaseNotesModal />
    </div>
  );
}
