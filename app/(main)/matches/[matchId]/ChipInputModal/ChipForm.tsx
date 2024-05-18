"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ModalBody, ModalFooter } from "@/components/Modal";
import { Match } from "@/lib/type";
import { useChipInputModal } from "../useChipInputModal";
import { addChip } from "./actions";

type Schema = {
  playerChip: {
    profileId: string;
    chipCount: string;
  }[];
};

export function ChipForm({ match }: { match: Match }) {
  const chipInputModal = useChipInputModal();
  const { players, rule } = match;
  const [{ errors, success }, formAction] = useFormState(
    addChip.bind(null, match.id, players.length),
    {},
  );

  const { control, watch, setValue, setFocus } = useForm<Schema>({
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
      chipInputModal.onClose();
    }
  }, [chipInputModal, success]);

  return (
    <form action={formAction}>
      <ModalBody>
        <ul className="space-y-1">
          {fields.map((field, index) => (
            <li key={field.id} className="flex items-center gap-1">
              <Controller
                control={control}
                name={`playerChip.${index}.profileId`}
                render={({ field }) => <input type="text" hidden {...field} />}
              />
              <div className="shrink-0 grow text-small text-foreground">
                {players[index].name}
              </div>
              <Controller
                control={control}
                name={`playerChip.${index}.chipCount`}
                render={({ field }) => (
                  <Input
                    labelPlacement="outside-left" // 中心ずれを防ぐ
                    classNames={{
                      base: "basis-[160px] shrink-0",
                      input: "text-right placeholder:text-default-400",
                    }}
                    type="number"
                    size="lg"
                    startContent={
                      isAutoFillAvailable &&
                      field.value === "" && (
                        <>
                          <Button
                            variant="flat"
                            size="sm"
                            radius="md"
                            color="secondary"
                            className="h-6 w-max min-w-0 shrink-0 gap-1 px-2 text-[10px]"
                            onClick={() => {
                              setValue(field.name, String(-1 * totalChipCount));
                              setFocus(field.name);
                            }}
                          >
                            残り入力
                          </Button>
                        </>
                      )
                    }
                    endContent={
                      <div className="pointer-events-none shrink-0">
                        <span className="text-small text-default-400">枚</span>
                      </div>
                    }
                    {...field}
                  />
                )}
              />
            </li>
          ))}
        </ul>
        {errors?.playerChip && (
          <p className="whitespace-pre-wrap text-tiny text-danger">
            {errors.playerChip[0]}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onClick={chipInputModal.onClose}>
          キャンセル
        </Button>
        <Button type="submit" color="primary">
          保存
        </Button>
      </ModalFooter>
    </form>
  );
}
