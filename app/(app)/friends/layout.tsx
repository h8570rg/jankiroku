import Link from "next/link";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="heading-1">フレンド</h1>
        <Button as={Link} variant="light" isIconOnly href="/friends?add=true">
          <Icon name="personAdd" className="h-5 w-5 fill-current" />
        </Button>
      </div>
      {children}
    </div>
  );
}
