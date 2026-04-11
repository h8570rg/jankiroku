"use client";

import { getFieldValue, useForm, useFormData } from "@conform-to/react/future";
import {
  cn,
  Drawer,
  FieldError,
  InputGroup,
  Label,
  ListBox,
  Popover,
  Select,
  Separator,
  TextField,
} from "@heroui/react";
import { ChevronDown, ChevronUp, CircleHelp } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import type { Match } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { createGame } from "./actions";
import { createCreateGameSchema } from "./schema";

export type CreateGameDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match;
};

export function CreateGameDrawer({
  isOpen,
  onOpenChange,
  match,
}: CreateGameDrawerProps) {
  const { rule } = match;
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(createGame.bind(null, match.id, rule), {
      onSuccess: () => onOpenChange(false),
    }),
    null,
  );

  const { form, fields, intent } = useForm(
    createCreateGameSchema({
      playersCount: rule.playersCount,
      defaultPoints: rule.defaultPoints,
    }),
    {
      lastResult,
      onSubmit: createSubmitHandler(formAction),
      defaultValue: {
        players: match.players.map((player) => ({
          id: player.id,
          points: "",
          name: player.name,
        })),
      },
    },
  );

  const playersFieldList = fields.players.getFieldList();

  const players =
    useFormData(form.id, (formData) =>
      getFieldValue(formData, fields.players.name, {
        type: "object",
        array: true,
      }),
    ) ?? [];

  const totalPoints = players.reduce(
    (sum, p) => sum + (Number(p.points) || 0),
    0,
  );
  const totalPointsToBe = rule.defaultPoints * rule.playersCount;
  const filledCount = players.filter((p) => p.points !== "").length;
  const isAutoFillAvailable = filledCount === rule.playersCount - 1;

  const hasTiedPlayers = (() => {
    const filled = players.map((p) => p.points).filter((v) => v !== "");
    if (filled.length < 2) return false;
    return new Set(filled).size < filled.length;
  })();

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      intent.reset();
    }
  }

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content placement="bottom">
        <Drawer.Dialog>
          <Drawer.Header className="flex flex-row items-center justify-between">
            <Drawer.Heading>結果入力</Drawer.Heading>
            <Popover>
              <Button className="gap-1" variant="ghost" size="sm">
                <span className="text-accent underline">同点の場合</span>
                <CircleHelp className="text-accent" />
              </Button>
              <Popover.Content className="max-w-[280px] bg-surface-secondary">
                <Popover.Dialog>
                  点数が同じプレイヤーがいる場合、順番が先のプレイヤーの着順が上になります。名前の左のアイコンをドラッグ&ドロップして順番を変更できます。
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
          </Drawer.Header>
          <Drawer.Body className="p-1">
            <Form
              validationErrors={form.fieldErrors}
              className="space-y-3"
              {...form.props}
            >
              <div>
                <ul className="space-y-2">
                  {playersFieldList.map((player, index) => {
                    const playerFields = player.getFieldset();
                    const playerPoints = players?.[index]?.points;
                    return (
                      <li key={player.key}>
                        <input
                          type="hidden"
                          name={playerFields.id.name}
                          value={playerFields.id.defaultValue}
                        />
                        <input
                          type="hidden"
                          name={playerFields.name.name}
                          value={playerFields.name.defaultValue}
                        />
                        <TextField
                          className="flex min-w-0 flex-row items-center gap-2"
                          variant="secondary"
                          type="number"
                          name={playerFields.points.name}
                          autoFocus={index === 0}
                        >
                          <Label
                            className="grow text-sm text-foreground"
                          >
                            {playerFields.name.defaultValue}
                          </Label>
                          <InputGroup className="min-w-0 shrink-0 basis-40">
                            {isAutoFillAvailable && !playerPoints && (
                              <InputGroup.Prefix>
                                <Button
                                  size="sm"
                                  className="
                                    h-6 w-max min-w-0 shrink-0 gap-1 px-2
                                    text-[10px]
                                  "
                                  type="button"
                                  variant="secondary"
                                  onPress={() => {
                                    const remainder =
                                      totalPointsToBe - totalPoints;
                                    intent.update({
                                      name: fields.players.name,
                                      index,
                                      value: {
                                        id:
                                          (players?.[index] as { id?: string })
                                            ?.id ?? "",
                                        points: String(remainder),
                                        name: playerFields.name.defaultValue,
                                      },
                                    });
                                  }}
                                >
                                  残り入力
                                </Button>
                              </InputGroup.Prefix>
                            )}
                            <InputGroup.Input className="min-w-0 text-right" />
                            <InputGroup.Suffix>
                              <span
                                className={cn("mt-0.5 mr-1 text-xs", {
                                  "text-foreground": !!playerPoints,
                                })}
                              >
                                00
                              </span>
                              点
                            </InputGroup.Suffix>
                          </InputGroup>
                          <FieldError />
                        </TextField>
                        {hasTiedPlayers && (
                          <div className="flex shrink-0 flex-col gap-0">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="min-w-0 p-1"
                              isIconOnly
                              isDisabled={index === 0}
                              onPress={() => {
                                intent.reorder({
                                  name: fields.players.name,
                                  from: index,
                                  to: index - 1,
                                });
                              }}
                            >
                              <ChevronUp />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="min-w-0 p-1"
                              isIconOnly
                              isDisabled={index === playersFieldList.length - 1}
                              onPress={() => {
                                intent.reorder({
                                  name: fields.players.name,
                                  from: index,
                                  to: index + 1,
                                });
                              }}
                            >
                              <ChevronDown />
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {form.fieldErrors?.players?.[0] && (
                  <p className="mt-1 text-xs whitespace-pre-wrap text-danger">
                    {form.fieldErrors.players[0]}
                  </p>
                )}
              </div>
              <Separator />
              <Select
                variant="secondary"
                name={fields.crackBoxPlayerId.name}
                defaultValue={fields.crackBoxPlayerId.defaultValue}
              >
                <div className="flex flex-row items-center gap-2">
                  <Label className="grow">飛ばした人</Label>
                  <Select.Trigger className="shrink-0 basis-50">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                </div>
                <Select.Popover>
                  <ListBox>
                    {[
                      { key: "", label: "なし" },
                      ...match.players.map((player) => ({
                        key: player.id,
                        label: player.name ?? "",
                      })),
                    ].map((item) => (
                      <ListBox.Item
                        key={item.key}
                        id={item.key}
                        textValue={item.label}
                      >
                        {item.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>
            </Form>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="ghost" slot="close">
              キャンセル
            </Button>
            <Button
              form={form.props.id}
              type="submit"
              variant="primary"
              isPending={isPending}
            >
              保存
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
