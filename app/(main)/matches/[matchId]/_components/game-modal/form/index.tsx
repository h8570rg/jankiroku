"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowsExpandVertical } from "@gravity-ui/icons";
import { cn } from "@heroui/react";
import { useActionState, useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Select } from "@/components/select";
import { TextField } from "@/components/text-field";
import type { Match } from "@/lib/type";
import { useMatchContext } from "../../../context";
import { addGame } from "./actions";

type Schema = {
  players: {
    id: string;
    name: string | null;
    points?: string;
  }[];
  crackBoxPlayerId?: string;
};

export function GameForm({ match }: { match: Match }) {
  const gameModal = useMatchContext().gameModal;

  const { rule } = match;
  const [{ errors, success }, formAction, isPending] = useActionState(
    addGame.bind(null, match.id, rule, match.players.length),
    {},
  );

  const { control, watch, setValue } = useForm<Schema>({
    defaultValues: {
      players: match.players.map((player) => ({
        id: player.id,
        name: player.name,
        points: "",
      })),
    },
  });

  const { fields, move } = useFieldArray<Schema>({
    control,
    name: "players",
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        move(oldIndex, newIndex);
      }
    },
    [fields, move],
  );

  const players = watch("players");

  const isAutoFillAvailable =
    players.filter(({ points }) => points !== "").length ===
    rule.playersCount - 1;

  const totalPoints = players.reduce(
    (sum, { points }) => sum + Number(points),
    0,
  );

  const totalPointsToBe = (rule.defaultPoints * rule.playersCount) / 100;

  useEffect(() => {
    if (success) {
      gameModal.close();
    }
  }, [gameModal, success]);

  return (
    <form className="contents" action={formAction}>
      <Modal.Body className="p-1">
        <ul className="space-y-1">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={fields}>
              {fields.map((field, index) => {
                const name = `players.${index}.points` as const;
                const points = watch(name);
                return (
                  <SortableItem key={field.id} id={field.id}>
                    {({ attributes, listeners }) => (
                      <div className="flex items-center gap-1">
                        <Controller
                          control={control}
                          name={`players.${index}.id`}
                          render={({ field }) => (
                            <input type="text" hidden {...field} />
                          )}
                        />
                        <div className="shrink-0 grow text-sm text-foreground">
                          {field.name}
                        </div>
                        <Controller
                          control={control}
                          name={`players.${index}.points`}
                          render={({ field }) => (
                            <TextField
                              className="shrink-0 basis-[160px]"
                              classNames={{
                                input:
                                  "w-full text-right placeholder:text-default-400",
                              }}
                              fullWidth
                              variant="secondary"
                              type="number"
                              autoFocus={index === 0}
                              prefix={
                                isAutoFillAvailable &&
                                points === "" && (
                                  <Button
                                    size="sm"
                                    className="
                                      h-6 w-max min-w-0 shrink-0 gap-1 px-2
                                      text-[10px]
                                    "
                                    onPress={() => {
                                      setValue(
                                        name,
                                        String(totalPointsToBe - totalPoints),
                                      );
                                    }}
                                  >
                                    残り入力
                                  </Button>
                                )
                              }
                              suffix={
                                <>
                                  <span
                                    className={cn("mt-0.5 mr-1 text-xs", {
                                      "text-foreground":
                                        watch(`players.${index}.points`) !== "",
                                    })}
                                  >
                                    00
                                  </span>
                                  点
                                </>
                              }
                              {...field}
                            />
                          )}
                        />
                        <div
                          className="flex w-6 shrink-0 touch-none items-center"
                          {...attributes}
                          {...listeners}
                        >
                          <ArrowsExpandVertical />
                        </div>
                      </div>
                    )}
                  </SortableItem>
                );
              })}
            </SortableContext>
          </DndContext>
        </ul>
        {errors?.players && (
          <p className="text-xs whitespace-pre-wrap text-danger">
            {errors.players[0]}
          </p>
        )}
        <Controller
          control={control}
          name="crackBoxPlayerId"
          render={({ field }) => (
            <Select
              variant="secondary"
              label="飛ばした人"
              labelPlacement="outside"
              defaultValue=""
              errorMessage={errors?.crackBoxPlayerId?.[0]}
              items={[
                { key: "", label: "なし" },
                ...players.map((player) => ({
                  key: player.id,
                  label: player.name ?? "",
                })),
              ]}
              {...field}
            />
          )}
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
    </form>
  );
}

type UseSortableReturn = Omit<
  ReturnType<typeof useSortable>,
  "setNodeRef" | "transform" | "transition"
>;

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: UseSortableReturn) => React.ReactNode;
}) {
  const { setNodeRef, transform, transition, ...rest } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style}>
      {children({ ...rest })}
    </li>
  );
}
