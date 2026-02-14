"use client";

import { useActionState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { TextField } from "@/components/text-field";
import type { Match } from "@/lib/type";
import { useMatchContext } from "../../../context";
import { addChip } from "./actions";

type Schema = {
  playerChip: {
    profileId: string;
    chipCount: string;
  }[];
};

export function ChipForm({ match }: { match: Match }) {
  const { chipModal } = useMatchContext();
  const { players, rule } = match;
  const [{ errors, success }, formAction, isPending] = useActionState(
    addChip.bind(null, match.id, players.length),
    {},
  );

  const { control, watch, setValue } = useForm<Schema>({
    defaultValues: {
      playerChip: players.map((player) => ({
        profileId: player.id,
        chipCount: "",
      })),
    },
  });

  const { fields } = useFieldArray<Schema>({
    control,
    name: "playerChip",
  });

  const playerChip = watch("playerChip");

  const isAutoFillAvailable =
    playerChip.filter(({ chipCount }) => chipCount !== "").length ===
    rule.playersCount - 1;

  const totalChipCount = playerChip.reduce(
    (sum, { chipCount }) => sum + Number(chipCount),
    0,
  );

  useEffect(() => {
    if (success) {
      chipModal.close();
    }
  }, [chipModal, success]);

  return (
    <form className="contents" action={formAction}>
      <Modal.Body>
        <ul className="space-y-1">
          {fields.map((field, index) => (
            <li key={field.id} className="flex items-center gap-1">
              <Controller
                control={control}
                name={`playerChip.${index}.profileId`}
                render={({ field }) => <input type="text" hidden {...field} />}
              />
              <div className="shrink-0 grow text-sm text-foreground">
                {players[index].name}
              </div>
              <Controller
                control={control}
                name={`playerChip.${index}.chipCount`}
                render={({ field }) => (
                  <TextField
                    className="flex flex-row items-center gap-2"
                    classNames={{
                      input: "text-right placeholder:text-default-400",
                    }}
                    variant="secondary"
                    type="number"
                    prefix={
                      isAutoFillAvailable &&
                      field.value === "" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="
                            h-6 w-max min-w-0 shrink-0 gap-1 px-2 text-[10px]
                          "
                          onPress={() => {
                            setValue(field.name, String(-1 * totalChipCount));
                          }}
                        >
                          残り入力
                        </Button>
                      )
                    }
                    suffix="枚"
                    {...field}
                  />
                )}
              />
            </li>
          ))}
        </ul>
        {errors?.playerChip && (
          <p className="text-xs whitespace-pre-wrap text-danger">
            {errors.playerChip[0]}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onPress={chipModal.close}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary" isPending={isPending}>
          保存
        </Button>
      </Modal.Footer>
    </form>
  );
}
