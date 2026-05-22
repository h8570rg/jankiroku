import { Typography } from "@heroui/react";

export default function ReleaseNotes_0_1_0() {
  return (
    <>
      <Typography type="h2">Version 0.1.1</Typography>
      <ol className="list-inside list-disc">
        <li>ゲーム結果削除機能追加</li>
        <li>ゲーム入力において一部端末で画面が拡大してしまう問題の修正</li>
      </ol>
    </>
  );
}
