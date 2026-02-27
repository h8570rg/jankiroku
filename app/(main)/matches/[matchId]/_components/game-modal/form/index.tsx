"use client";

import {
  parseSubmission,
  useForm,
  useFormData,
} from "@conform-to/react/future";
import { ChevronDown, ChevronUp } from "@gravity-ui/icons";
import { cn } from "@heroui/react";
import { useActionState, useRef } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Modal } from "@/components/modal";
import { Select } from "@/components/select";
import { TextField } from "@/components/text-field";
import type { Match } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { useMatchContext } from "../../../context";
import { addGame } from "./actions";
import { addGameFormSchema } from "./schema";

export function GameForm({ match }: { match: Match }) {
  const formRef = useRef<HTMLFormElement>(null);
  const gameModal = useMatchContext().gameModal;

  const { rule } = match;
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(addGame.bind(null, match.id, rule, match.players.length), {
      onSuccess() {
        gameModal.close();
      },
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
      })),
    },
  });

  const payload = useFormData(
    formRef,
    (fd) => (fd ? parseSubmission(fd).payload : null),
    { fallback: null },
  );
  const playerList = Array.isArray(payload?.players)
    ? payload.players
    : payload?.players && typeof payload.players === "object"
      ? Object.keys(payload.players)
          .sort((a, b) => Number(a) - Number(b))
          .map((i) => (payload.players as Record<string, unknown>)[i])
      : [];
  const pointsList = playerList.map((item: unknown) =>
    String((item as Record<string, unknown>)?.points ?? ""),
  );
  const totalPoints = pointsList.reduce((sum, v) => sum + (Number(v) || 0), 0);
  const totalPointsToBe = rule.defaultPoints * rule.playersCount;
  const filledCount = pointsList.filter((v) => v !== "").length;
  const isAutoFillAvailable = filledCount === rule.playersCount - 1;

  const playerListFields = fields.players.getFieldList();

  return (
    <Form
      ref={formRef}
      className="contents"
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <Modal.Body className="p-1">
        <ul className="space-y-1">
          {playerListFields.map((item, index) => {
            const fieldset = item.getFieldset();
            const points = pointsList[index] ?? "";
            return (
              <li key={item.key} className="flex items-center gap-1">
                <input
                  type="hidden"
                  name={fieldset.id.name}
                  value={(playerList[index] as { id?: string })?.id ?? ""}
                />
                <div className="shrink-0 grow text-sm text-foreground">
                  {match.players.find(
                    (p) => p.id === (playerList[index] as { id?: string })?.id,
                  )?.name ?? ""}
                </div>
                <TextField
                  className="shrink-0 basis-[160px]"
                  classNames={{
                    input: "w-full text-right placeholder:text-default-400",
                  }}
                  fullWidth
                  variant="secondary"
                  type="number"
                  name={fieldset.points.name}
                  autoFocus={index === 0}
                  prefix={
                    isAutoFillAvailable && points === "" ? (
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
                                (playerList[index] as { id?: string })?.id ??
                                "",
                              points: String(remainder),
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
                          "text-foreground": points !== "",
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
                    isDisabled={index === playerListFields.length - 1}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onPress={gameModal.close}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary" isPending={isPending}>
          保存
        </Button>
      </Modal.Footer>
    </Form>
  );
}
