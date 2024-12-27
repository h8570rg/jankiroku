import Appbar from "./(components)/Appbar";
import { ReleaseNotes } from "./(components)/ReleaseNotes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Appbar />
      <main className="flex-1 px-4">{children}</main>
      <ReleaseNotes />
    </div>
  );
}
