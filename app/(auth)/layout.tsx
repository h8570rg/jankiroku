import Image from "next/image";
import MahJong1Image from "~/assets/images/mahjong1.jpeg";
import Logo from "~/components/Logo";

export default function Auth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <Image
          src={MahJong1Image}
          className="size-full object-cover"
          alt="mahjong"
        />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-background opacity-[0.98]" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <main className="w-full">
          <Logo className="mx-auto mb-8 w-fit text-[40px]" />
          {children}
        </main>
      </div>
    </>
  );
}
