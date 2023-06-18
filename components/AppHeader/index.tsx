import Logo from "../Logo";

export function AppHeader() {
  return (
    <header className="z-header sticky top-0 flex items-center justify-between">
      <div className="flex items-center">
        <Logo />
      </div>
    </header>
  );
}
