import { AppHeader } from "~/components/AppHeader";
import { BottomNavigation } from "~/components/BottomNavigation";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppHeader />
      <main>{children}</main>
      <BottomNavigation />
    </div>
  );
}
