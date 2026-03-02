export function AvatarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex -space-x-2
        *:ring-2 *:ring-background
      "
    >
      {children}
    </div>
  );
}
