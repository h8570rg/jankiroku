import dynamic from "next/dynamic";
import Appbar from "./(components)/Appbar";

// TODO: Implement ReleaseNotesModal
const ReleaseNotesModal = dynamic(
  () => import("./(components)/ReleaseNotesModal"),
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Appbar />
      <main className="flex-1 px-4">{children}</main>
      <ReleaseNotesModal />
    </div>
  );
}
