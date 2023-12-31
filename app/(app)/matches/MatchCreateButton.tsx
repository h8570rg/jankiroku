"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Accordion, AccordionItem } from "~/components/Accordion";
import { Button, ButtonGroup } from "~/components/Button";
import { Input } from "~/components/Input";
import { useDisclosure } from "~/components/Modal";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "~/components/Modal";
import { Select, SelectItem } from "~/components/Select";
import {
  MatchCreateSchema,
  matchCreateSchema,
  useMatchCreate,
} from "~/lib/hooks/api/match";
import { calcMethod } from "~/lib/utils/schemas";

const playersCount4DefaultValues: Partial<MatchCreateSchema> = {
  playersCount: 4,
  /** @see https://github.com/react-hook-form/react-hook-form/issues/8382 */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  crackBoxBonus: "10000",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultPoints: "25000",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultCalcPoints: "30000",
  calcMethod: "round",
  incline: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline1: "",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline2: "",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline3: "",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline4: "",
  },
};

const playersCount3DefaultValues: Partial<MatchCreateSchema> = {
  playersCount: 3,
  /** @see https://github.com/react-hook-form/react-hook-form/issues/8382 */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  crackBoxBonus: "10000",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultPoints: "35000",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultCalcPoints: "40000",
  calcMethod: "round",
  incline: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline1: "",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline2: "",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline3: "",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incline4: "0",
  },
};

export function MatchCreateButton({ className }: { className?: string }) {
  const router = useRouter();
  const { trigger: createMatch } = useMatchCreate();
  const ruleCreateModal = useDisclosure();

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    register,
    clearErrors,
  } = useForm<MatchCreateSchema>({
    resolver: zodResolver(matchCreateSchema),
    defaultValues: playersCount4DefaultValues,
  });

  const playersCount = watch("playersCount");

  const onRuleCreateSubmit: SubmitHandler<MatchCreateSchema> = useCallback(
    async (data) => {
      const match = await createMatch(data);
      router.push(`/matches/${match.id}`);
    },
    [createMatch, router],
  );

  const handlePlayersCount4Click = useCallback(() => {
    Object.entries(playersCount4DefaultValues).forEach(([key, value]) => {
      setValue(key as keyof MatchCreateSchema, value);
    });
    clearErrors();
  }, [clearErrors, setValue]);

  const handlePlayersCount3Click = useCallback(() => {
    Object.entries(playersCount3DefaultValues).forEach(([key, value]) => {
      setValue(key as keyof MatchCreateSchema, value);
    });
    clearErrors();
  }, [clearErrors, setValue]);

  const inclineError = errors.incline;
  const inclineErrorMessage = (
    inclineError?.incline1 ??
    inclineError?.incline2 ??
    inclineError?.incline3 ??
    inclineError?.incline4 ??
    inclineError?.root
  )?.message;

  return (
    <>
      <Button
        className={className}
        size="lg"
        color="primary"
        onClick={ruleCreateModal.onOpen}
      >
        ゲームを始める
      </Button>
      <Modal
        isOpen={ruleCreateModal.isOpen}
        onOpenChange={ruleCreateModal.onOpenChange}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>ルール設定</ModalHeader>
              <form onSubmit={handleSubmit(onRuleCreateSubmit)}>
                <ModalBody>
                  <ButtonGroup className="mb-3" fullWidth>
                    <Button
                      color={playersCount === 4 ? "primary" : "default"}
                      onClick={handlePlayersCount4Click}
                    >
                      四麻
                    </Button>
                    <Button
                      color={playersCount === 3 ? "primary" : "default"}
                      onClick={handlePlayersCount3Click}
                    >
                      三麻
                    </Button>
                  </ButtonGroup>
                  <div className="flex items-center">
                    <div className="shrink-0 basis-14 pr-2 text-small">
                      ウマ
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          label="1着"
                          {...register("incline.incline1")}
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          label="2着"
                          {...register("incline.incline2")}
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          label="3着"
                          {...register("incline.incline3")}
                        />
                        {playersCount === 4 && <span>-</span>}
                        <Input
                          className={classNames({ hidden: playersCount === 3 })}
                          hidden={playersCount === 3}
                          type="number"
                          label="4着"
                          {...register("incline.incline4")}
                        />
                      </div>
                      {/* same as Input component error */}
                      <div className="px-1 pt-1 text-tiny text-danger">
                        {inclineErrorMessage}
                      </div>
                    </div>
                  </div>

                  <Input
                    classNames={{
                      label: "shrink-0 basis-14",
                      mainWrapper: "w-full",
                    }}
                    type="number"
                    label="レート"
                    labelPlacement="outside-left"
                    description="5: テンゴ、10: テンピン"
                    {...register("rate")}
                    errorMessage={errors.rate?.message}
                  />
                  <Input
                    classNames={{
                      label: "shrink-0 basis-14",
                      mainWrapper: "w-full",
                    }}
                    type="number"
                    label="チップ"
                    labelPlacement="outside-left"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">円</span>
                      </div>
                    }
                    {...register("chipRate")}
                    errorMessage={errors.chipRate?.message}
                  />
                  <Accordion isCompact className="px-0">
                    <AccordionItem
                      title="詳細設定"
                      hideIndicator
                      classNames={{
                        titleWrapper: "text-right",
                        title: "text-small text-primary",
                      }}
                    >
                      <div className="space-y-3 px-1">
                        <Input
                          classNames={{
                            label: "shrink-0 basis-14",
                            mainWrapper: "w-full",
                          }}
                          type="number"
                          label="飛び賞"
                          labelPlacement="outside-left"
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-small text-default-400">
                                点
                              </span>
                            </div>
                          }
                          {...register("crackBoxBonus")}
                          errorMessage={errors.crackBoxBonus?.message}
                        />
                        <Input
                          classNames={{
                            label: "shrink-0 basis-14",
                            mainWrapper: "w-full",
                          }}
                          type="number"
                          label="持ち点"
                          labelPlacement="outside-left"
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-small text-default-400">
                                点
                              </span>
                            </div>
                          }
                          {...register("defaultPoints")}
                          errorMessage={errors.defaultPoints?.message}
                        />
                        <Input
                          classNames={{
                            label: "shrink-0 basis-14",
                            mainWrapper: "w-full",
                          }}
                          type="number"
                          label="オカ"
                          labelPlacement="outside-left"
                          endContent={
                            <div className="pointer-events-none flex shrink-0 items-center">
                              <span className="text-small text-default-400">
                                点返し
                              </span>
                            </div>
                          }
                          {...register("defaultCalcPoints")}
                          errorMessage={errors.defaultCalcPoints?.message}
                        />
                        <Select
                          classNames={{
                            base: "items-center",
                            label: "shrink-0 basis-14",
                            mainWrapper: "w-full",
                          }}
                          label="計算"
                          labelPlacement="outside-left"
                          defaultSelectedKeys={["round"]}
                          {...register("calcMethod")}
                          errorMessage={errors.calcMethod?.message}
                        >
                          {Object.entries(calcMethod).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onClick={onClose}>
                    キャンセル
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    開始
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
