"use client";

import {
  parseSubmission,
  useForm,
  useFormData,
} from "@conform-to/react/future";
import { useActionState, useRef } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Modal } from "@/components/modal";
import { TextField } from "@/components/text-field";
import type { Match } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { addChip } from "./actions";
import { addChipSchema } from "./schema";

export function ChipForm({
  match,
  onOpenChange,
}: {
  match: Match;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { players, rule } = match;

  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(addChip, {
      onSuccess() {
        onOpenChange(false);
      },
    }),
    null,
  );
  const { form, fields, intent } = useForm(addChipSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    defaultValue: {
      playerChip: players.map((p) => ({ profileId: p.id, chipCount: "" })),
    },
  });

  const payload = useFormData(
    formRef,
    (fd) => (fd ? parseSubmission(fd).payload : null),
    { fallback: null },
  );
  const playerChipList = Array.isArray(payload?.playerChip)
    ? payload.playerChip
    : payload?.playerChip && typeof payload.playerChip === "object"
      ? Object.keys(payload.playerChip)
          .sort((a, b) => Number(a) - Number(b))
          .map((i) => (payload.playerChip as Record<string, unknown>)[i])
      : [];
  const chipCounts = playerChipList.map((item: unknown) =>
    String((item as Record<string, unknown>)?.chipCount ?? ""),
  );
  const totalChipCount = chipCounts.reduce((sum, v) => sum + Number(v) || 0, 0);
  const filledCount = chipCounts.filter((v) => v !== "").length;
  const isAutoFillAvailable = filledCount === rule.playersCount - 1;

  const playerChipListFields = fields.playerChip.getFieldList();

  return (
    <Form
      ref={formRef}
      className="contents"
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <input type="hidden" name="matchId" value={match.id} />
      <Modal.Body>
        <ul className="space-y-1">
          {playerChipListFields.map((item, index) => {
            const fieldset = item.getFieldset();
            return (
              <li key={item.key} className="flex items-center gap-1">
                <input
                  type="hidden"
                  name={fieldset.profileId.name}
                  value={players[index].id}
                />
                <div className="shrink-0 grow text-sm text-foreground">
                  {players[index].name}
                </div>
                <TextField
                  className="flex flex-row items-center gap-2"
                  classNames={{
                    input: "text-right placeholder:text-default-400",
                  }}
                  variant="secondary"
                  type="number"
                  name={fieldset.chipCount.name}
                  prefix={
                    isAutoFillAvailable && chipCounts[index] === "" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-6 w-max min-w-0 shrink-0 gap-1 px-2 text-[10px]"
                        type="button"
                        onPress={() => {
                          intent.update({
                            name: fields.playerChip.name,
                            index,
                            value: {
                              profileId: players[index].id,
                              chipCount: String(-1 * totalChipCount),
                            },
                          });
                        }}
                      >
                        残り入力
                      </Button>
                    ) : undefined
                  }
                  suffix="枚"
                />
              </li>
            );
          })}
        </ul>
        {form.errors && (
          <p className="text-xs whitespace-pre-wrap text-danger">
            {form.errors}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onPress={() => onOpenChange(false)}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary" isPending={isPending}>
          保存
        </Button>
      </Modal.Footer>
    </Form>
  );
}
