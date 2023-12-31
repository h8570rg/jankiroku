import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { ComponentProps, useCallback } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "~/components/Modal";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/Popover";
import { Select, SelectItem } from "~/components/Select";
import {
  GameAddSchema,
  gameAddSchema,
  useGameAdd,
} from "~/lib/hooks/api/games";
import { useMatch } from "~/lib/hooks/api/match";
import { Match } from "~/lib/services/match";

export function GameInputModal({
  match: defaultMatch,
  isOpen,
  onOpenChange,
  onClose,
}: {
  match: Match;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
}) {
  const { data: match } = useMatch(defaultMatch);
  const { trigger: addGame } = useGameAdd(match.id, match.rule);
  const { players, rule } = match;

  const onSubmit: SubmitHandler<GameAddSchema> = async (data) => {
    await addGame(data);
    reset();
    onClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    reset,
    setFocus,
  } = useForm<GameAddSchema>({
    resolver: zodResolver(gameAddSchema(match.rule)),
    defaultValues: {
      /** @see https://github.com/react-hook-form/react-hook-form/issues/8382 */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      playerPoints: players.map((player) => ({
        name: player.name,
        profileId: player.id,
        points: "",
      })),
    },
  });

  const { fields, move } = useFieldArray<GameAddSchema>({
    control,
    name: "playerPoints",
  });

  const handleDragEnd = useCallback<
    NonNullable<ComponentProps<typeof DndContext>["onDragEnd"]>
  >(
    (event) => {
      const { active, over } = event;
      if (over && active.id !== over?.id) {
        const activeIndex = active.data.current?.sortable?.index;
        const overIndex = over.data.current?.sortable?.index;
        if (activeIndex !== undefined && overIndex !== undefined) {
          move(activeIndex, overIndex);
        }
      }
    },
    [move],
  );

  const playerPoints = watch("playerPoints");

  const isAutoFillAvailable =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    playerPoints.filter(({ points }) => points !== "").length ===
    rule.playersCount - 1;

  const totalPoints = playerPoints.reduce(
    (sum, { points }) => sum + Number(points),
    0,
  );

  const totalPointsToBe = (rule.defaultPoints * rule.playersCount) / 100;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      onClose={reset}
    >
      {/* TODO: ModalContentに対してonCloseを親から渡してる箇所を修正 */}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between">
              <div>結果入力</div>
              <Popover size="sm" color="secondary">
                <PopoverTrigger>
                  <Button className="gap-1" variant="light" size="sm">
                    <span className="text-secondary underline">同点の場合</span>
                    <Icon className="h-4 w-4 fill-secondary" name="help" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[280px] py-2">
                  点数が同じプレイヤーがいる場合、順番が先のプレイヤーの着順が上になります。名前の左のアイコンをドラッグ&ドロップして順番を変更できます。
                </PopoverContent>
              </Popover>
            </ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <DndContext onDragEnd={handleDragEnd}>
                  <SortableContext items={fields}>
                    {fields.map((field, index) => {
                      const name = `playerPoints.${index}.points` as const;
                      const points = watch(name);
                      return (
                        <SortableItem key={field.id} id={field.id}>
                          {({ attributes, listeners }) => (
                            <div className="flex items-center gap-1">
                              <div
                                className="flex w-6 shrink-0 items-center"
                                {...attributes}
                                {...listeners}
                              >
                                <Icon
                                  className="h-5 w-5 fill-current"
                                  name="dragIndicator"
                                />
                              </div>
                              <input
                                type="text"
                                value={field.profileId}
                                {...register(`playerPoints.${index}.profileId`)}
                                hidden
                              />
                              <div className="shrink-0 grow text-small text-foreground">
                                {field.name}
                              </div>
                              <Input
                                classNames={{
                                  base: "basis-[160px] shrink-0",
                                  input:
                                    "text-right placeholder:text-default-400",
                                }}
                                type="number"
                                startContent={
                                  isAutoFillAvailable &&
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  points === "" && (
                                    <>
                                      <Button
                                        variant="flat"
                                        size="sm"
                                        radius="md"
                                        color="secondary"
                                        className="h-6 w-max min-w-0 shrink-0 gap-1 px-2 text-[10px]"
                                        onClick={() => {
                                          setValue(
                                            name,
                                            totalPointsToBe - totalPoints,
                                          );
                                          setFocus(name);
                                        }}
                                      >
                                        残り入力
                                      </Button>
                                    </>
                                  )
                                }
                                endContent={
                                  <div className="pointer-events-none flex shrink-0 items-center gap-1">
                                    <span
                                      className={classNames(
                                        "mt-0.5 text-tiny",
                                        {
                                          "text-default-400":
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            watch(
                                              `playerPoints.${index}.points`,
                                            ) === "",
                                        },
                                      )}
                                    >
                                      00
                                    </span>
                                    <span className="text-small text-default-400">
                                      点
                                    </span>
                                  </div>
                                }
                                {...register(`playerPoints.${index}.points`)}
                              />
                            </div>
                          )}
                        </SortableItem>
                      );
                    })}
                  </SortableContext>
                </DndContext>
                {errors.playerPoints?.root && (
                  <p className="whitespace-pre-wrap text-tiny text-danger">
                    {errors.playerPoints?.root.message}
                  </p>
                )}
                <Select
                  classNames={{
                    base: "items-center",
                    label: "shrink-0 basis-[120px]",
                  }}
                  label="飛ばした人"
                  labelPlacement="outside-left"
                  defaultSelectedKeys={[""]}
                  {...register("crackBoxPlayerId")}
                >
                  {[{ id: "", name: "なし" }, ...players].map((player) => (
                    <SelectItem key={player.id}>{player.name}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onClick={onClose}>
                  キャンセル
                </Button>
                <Button type="submit" color="primary" isLoading={isSubmitting}>
                  保存
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
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
    <div ref={setNodeRef} style={style}>
      {children({ ...rest })}
    </div>
  );
}
