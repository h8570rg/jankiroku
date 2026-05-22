import { Typography } from "@heroui/react";
import { SERVICE_NAME } from "@/lib/config";

export default function ReleaseNotes_0_1_0() {
  return (
    <>
      <Typography>{SERVICE_NAME}へようこそ！</Typography>
      <Typography>
        現在はベータ版ですが、機能の追加や改善を行っていく予定です。今後のアップデートにご期待ください！
      </Typography>
      <Typography type="h2">- 今後の機能追加予定 -</Typography>
      <ol className="list-inside list-disc">
        <li>半荘結果編集</li>
        <li>ユーザー情報編集</li>
        <li>フリー記録 など</li>
      </ol>
    </>
  );
}
