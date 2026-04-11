import { Alert } from "@heroui/react";

export function TiedPlayersAlert() {
  return (
    <Alert status="warning" className="bg-default">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>同点の場合</Alert.Title>
        <Alert.Description>
          点数が同じプレイヤーがいる場合、順番が先のプレイヤーの着順が上になります。矢印アイコンを押して順番を変更できます。
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
