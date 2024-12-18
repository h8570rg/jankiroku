import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import Logo from "@/components/Logo";
import match from "./(assets)/match.png";
import { FAQ } from "./(components)/FAQ";

const features = [
  {
    title: "成績を自動計算",
    description:
      "対局ごとの成績を持ち点数から自動で計算し、簡単に記録できます。",
  },
  {
    title: "対戦相手との同期",
    description:
      "一人が記録すれば、対戦相手のアプリ上でも記録が自動的に更新されます。",
  },
  {
    title: "フレンド機能",
    description:
      "よく対局する相手をフレンド登録し、簡単に成績表を作成できます。",
  },
  {
    title: "詳細なルール設定",
    description: "ウマやオカ、チップなど、詳細なルール設定が可能です。",
  },
];

const steps = [
  {
    number: 1,
    title: "ウェブサイトにアクセス",
    description:
      "ブラウザからアクセスするだけで、アプリのインストールは不要です。",
  },
  {
    number: 2,
    title: "アカウントを作成",
    description:
      "Googleアカウント、もしくはメールアドレスで簡単に登録できます。",
  },
  {
    number: 3,
    title: "対局を記録",
    description: "対局終了後、結果を入力するだけで自動的に成績が更新されます。",
  },
  {
    number: 4,
    title: "分析と改善",
    description:
      "蓄積されたデータを基に、自分の強みと弱みを分析し、技術向上に役立てます。",
  },
];

const faqs = [
  {
    question: "Janrecoは無料で使えますか？",
    answer: "無料でご利用いただけます。",
  },
  {
    question: "データのバックアップは可能ですか？",
    answer:
      "はい、クラウドにデータを自動的にバックアップしますので、端末を変更しても安心してご利用いただけます。",
  },
];

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-full">
      <Navbar shouldHideOnScroll>
        <NavbarBrand>
          <Logo className="text-large" />
        </NavbarBrand>
        <NavbarContent as="div" justify="end">
          <NavbarItem>
            <Button variant="flat" size="sm" as={Link} href="/login">
              ログイン
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-background to-primary/10">
        <div className="container z-20 mx-auto px-4 pt-20">
          <p className="mb-8 text-center text-large">
            麻雀の成績を簡単に記録・分析
            <br />
            あなたの麻雀ライフを快適に
          </p>
          <div className="flex justify-center gap-4">
            <Button color="primary" size="lg" as={Link} href="/login">
              今すぐ始める
            </Button>
            <Button size="lg" variant="ghost" as={"a"} href="#features">
              詳しく見る
            </Button>
          </div>
          <div className="mx-auto mt-12 h-[480px] w-4/5 max-w-[500px]">
            <Image
              src={match}
              alt="Janrecoアプリのインターフェース"
              sizes="80vw"
              className="size-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-24 px-5 py-16">
        {/* 機能紹介 */}
        <section id="features" className="">
          <h2 className="mb-12 text-center text-large font-semibold">
            主な機能
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="px-3">
                <CardBody className="py-8">
                  <h3 className="mb-2 text-center font-semibold">
                    {feature.title}
                  </h3>
                  <p>{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* 使用方法 */}
        <section className="">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-large font-semibold">
              使い方
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-secondary text-large font-bold text-secondary-foreground">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-medium font-semibold">
                    {step.title}
                  </h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-large font-semibold">
              よくある質問
            </h2>
            <FAQ faqs={faqs} />
          </div>
        </section>
      </div>

      {/* フッター */}
      <footer className="bg-primary py-8 text-center text-primary-foreground">
        <p>&copy; 2024 Janreco. All rights reserved.</p>
      </footer>
    </div>
  );
}
