import { Text } from "@heroui/react";
import { SERVICE_NAME } from "@/lib/config";

export default function ReleaseNotes_0_1_0() {
  return (
    <>
      <Text>{SERVICE_NAME}へようこそ！</Text>
      <Text>
        現在はベータ版ですが、機能の追加や改善を行っていく予定です。今後のアップデートにご期待ください！
      </Text>
      <Text type="h2">- 今後の機能追加予定 -</Text>
      <ol className="list-inside list-disc">
        <li>半荘結果編集</li>
        <li>ユーザー情報編集</li>
        <li>フリー記録 など</li>
      </ol>
    </>
  );
}
