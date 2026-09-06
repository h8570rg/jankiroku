import { HomeTabs } from "./_components/home-tabs";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HomeTabs />
      {children}
    </div>
  );
}
