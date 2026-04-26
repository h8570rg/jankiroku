"use client";

import { getFieldValue, useForm, useFormData } from "@conform-to/react/future";
import {
  Drawer,
  FieldError,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
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
      playerChip: players.map((p) => ({
        profileId: p.id,
        chipCount: p.chipCount != null ? String(p.chipCount) : "",
      })),
    },
  });

  const playerChips =
    useFormData(form.id, (formData) =>
      getFieldValue(formData, fields.playerChip.name, {
        type: "object",
        array: true,
      }),
    ) ?? [];

  const chipCounts = playerChips.map((p) =>
    String((p as { chipCount?: string })?.chipCount ?? ""),
  );
  const totalChipCount = chipCounts.reduce((sum, v) => sum + Number(v) || 0, 0);
  const filledCount = chipCounts.filter((v) => v !== "").length;
  const isAutoFillAvailable = filledCount === rule.playersCount - 1;

  const playerChipListFields = fields.playerChip.getFieldList();

  return (
    <Form
      className="contents"
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <input type="hidden" name="matchId" value={match.id} />
      <Drawer.Body className="space-y-3 p-1">
        <ul className="space-y-2">
          {playerChipListFields.map((item, index) => {
            const fieldset = item.getFieldset();
            return (
              <li key={item.key}>
                <input
                  type="hidden"
                  name={fieldset.profileId.name}
                  value={players[index].id}
                />
                <TextField
                  variant="secondary"
                  type="number"
                  name={fieldset.chipCount.name}
                  defaultValue={fieldset.chipCount.defaultValue}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Label className="grow text-sm text-foreground">
                      {players[index].name}
                    </Label>
                    <InputGroup className="min-w-0 shrink-0 basis-32">
                      {isAutoFillAvailable && chipCounts[index] === "" && (
                        <InputGroup.Prefix>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="
                              h-6 w-max min-w-0 shrink-0 gap-1 px-2 text-[10px]
                            "
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
                        </InputGroup.Prefix>
                      )}
                      <InputGroup.Input className="min-w-1 text-right" />
                      <InputGroup.Suffix>枚</InputGroup.Suffix>
                    </InputGroup>
                  </div>
                  <FieldError />
                </TextField>
              </li>
            );
          })}
        </ul>
        {form.errors && (
          <p className="text-xs whitespace-pre-wrap text-danger">
            {form.errors}
          </p>
        )}
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
    </Form>
  );
}
