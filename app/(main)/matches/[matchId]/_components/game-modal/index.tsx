"use client";

import { getFieldValue, useForm, useFormData } from "@conform-to/react/future";
import { cn } from "@heroui/react";
import { ChevronDown, ChevronUp, CircleHelp } from "lucide-react";
import { useActionState, useRef } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Modal } from "@/components/modal";
import { Popover } from "@/components/popover";
import { Select } from "@/components/select";
import { TextField } from "@/components/text-field";
import type { Match } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { addGame } from "./actions";
import { addGameFormSchema } from "./schema";

export type GameModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match;
};

export function GameModal({ isOpen, onOpenChange, match }: GameModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const { rule } = match;
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(addGame.bind(null, match.id, rule, match.players.length), {
      onSuccess: () => onOpenChange(false),
    }),
    null,
  );

  const { form, fields, intent } = useForm(addGameFormSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    defaultValue: {
      players: match.players.map((player) => ({
        id: player.id,
        points: "",
        name: player.name,
      })),
    },
  });

  const playersFieldList = fields.players.getFieldList();

  const players = useFormData(formRef, (formData) =>
    getFieldValue(formData, fields.players.name, {
      type: "object",
      array: true,
    }),
  ) as { id: string; points: string }[] | undefined;

  console.debug(players);

  const pointsList = players?.map((player) => player.points) ?? [];

  const totalPoints = pointsList.reduce((sum, v) => sum + (Number(v) || 0), 0);
  const totalPointsToBe = rule.defaultPoints * rule.playersCount;
  const filledCount = pointsList.filter((v) => v !== "").length;
  const isAutoFillAvailable = filledCount === rule.playersCount - 1;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container
        placement="bottom"
        scroll="inside"
        className="max-h-[calc(100%-2rem)]"
      >
        <Modal.Dialog>
          <Modal.Header className="flex flex-row items-center justify-between">
            <Modal.Heading>結果入力</Modal.Heading>
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
          </Modal.Header>
          <Modal.Body className="p-1">
            <Form
              ref={formRef}
              validationErrors={form.fieldErrors}
              {...form.props}
            >
              <ul className="space-y-1">
                {playersFieldList.map((player, index) => {
                  const playerFields = player.getFieldset();
                  const playerPoints = players?.[index]?.points;
                  return (
                    <li key={player.key} className="flex items-center gap-1">
                      <input
                        type="hidden"
                        name={playerFields.id.name}
                        value={playerFields.id.defaultValue}
                      />
                      <div className="shrink-0 grow text-sm text-foreground">
                        {playerFields.name.defaultValue}
                      </div>
                      <TextField
                        className="shrink-0 basis-[160px]"
                        classNames={{
                          input:
                            "w-full text-right placeholder:text-default-400",
                        }}
                        fullWidth
                        variant="secondary"
                        type="number"
                        name={playerFields.points.name}
                        autoFocus={index === 0}
                        prefix={
                          isAutoFillAvailable && !!playerPoints ? (
                            <Button
                              size="sm"
                              className="
                          h-6 w-max min-w-0 shrink-0 gap-1 px-2
                          text-[10px]
                        "
                              type="button"
                              variant="secondary"
                              onPress={() => {
                                const remainder = totalPointsToBe - totalPoints;
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
                          ) : undefined
                        }
                        suffix={
                          <>
                            <span
                              className={cn("mt-0.5 mr-1 text-xs", {
                                "text-foreground": !!playerPoints,
                              })}
                            >
                              00
                            </span>
                            点
                          </>
                        }
                      />
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
                    </li>
                  );
                })}
              </ul>
              {form.fieldErrors?.players?.[0] && (
                <p className="text-xs whitespace-pre-wrap text-danger">
                  {form.fieldErrors.players[0]}
                </p>
              )}
              <Select
                variant="secondary"
                label="飛ばした人"
                labelPlacement="outside"
                name={fields.crackBoxPlayerId.name}
                defaultValue=""
                items={[
                  { key: "", label: "なし" },
                  ...match.players.map((player) => ({
                    key: player.id,
                    label: player.name ?? "",
                  })),
                ]}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
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
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
