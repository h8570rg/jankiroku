"use client";

import classNames from "classnames";
import { useFormState } from "react-dom";
import { Controller, useForm } from "react-hook-form";
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
import { Slider } from "~/components/Slider";
import {
  calcMethod,
  inclineFor3Players,
  inclineFor4Players,
  rate,
} from "~/lib/utils/schemas";
import { createMatch, InputSchema } from "./actions";

const playersCount4DefaultValues: InputSchema = {
  playersCount: "4",
  crackBoxBonus: "10000",
  defaultPoints: "25000",
  defaultCalcPoints: "30000",
  calcMethod: "round",
  incline: "0_0_0_0",
  customIncline: {
    incline1: "",
    incline2: "",
    incline3: "",
    incline4: "",
  },
  rate: "0",
  chipRate: "",
};

const playersCount3DefaultValues: InputSchema = {
  playersCount: "3",
  crackBoxBonus: "10000",
  defaultPoints: "35000",
  defaultCalcPoints: "40000",
  calcMethod: "round",
  incline: "0_0_0_0",
  customIncline: {
    incline1: "",
    incline2: "",
    incline3: "",
    incline4: "0",
  },
  rate: "0",
  chipRate: "",
};

const rateSliderMaxValue = 8;

export function CreateMatchButton({ className }: { className?: string }) {
  const ruleCreateModal = useDisclosure();

  const [state, formAction] = useFormState(createMatch, {});
  const { errors } = state;

  const { reset, control, watch } = useForm<InputSchema>({
    defaultValues: playersCount4DefaultValues,
  });

  const playersCount = watch("playersCount");
  const incline = watch("incline");
  const inclineOption =
    playersCount === "4" ? inclineFor4Players : inclineFor3Players;

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
              <form action={formAction} noValidate>
                <ModalBody>
                  <Controller
                    control={control}
                    name="playersCount"
                    render={({ field: { onChange, value, name } }) => (
                      <>
                        <ButtonGroup className="mb-3" fullWidth>
                          <Button
                            color={value === "4" ? "primary" : "default"}
                            onClick={() => {
                              onChange("4");
                              reset(playersCount4DefaultValues);
                            }}
                          >
                            四麻
                          </Button>
                          <Button
                            color={value === "3" ? "primary" : "default"}
                            onClick={() => {
                              onChange("3");
                              reset(playersCount3DefaultValues);
                            }}
                          >
                            三麻
                          </Button>
                        </ButtonGroup>
                        <input
                          type="number"
                          hidden
                          name={name}
                          value={value}
                          readOnly
                        />
                      </>
                    )}
                  />
                  <Controller
                    control={control}
                    name="rate"
                    render={({ field: { onChange, value, ...field } }) => (
                      <>
                        <Slider
                          classNames={{
                            base: "mb-8",
                          }}
                          label="レート"
                          maxValue={rateSliderMaxValue}
                          showSteps
                          marks={Array.from({
                            length: rateSliderMaxValue + 1,
                          }).map((_, i) => ({
                            value: i,
                            label: rate[String(i)].value,
                          }))}
                          getValue={(v) => rate[String(v)].label}
                          onChange={(v) => {
                            onChange(String(v));
                          }}
                          value={Number(value)}
                          {...field}
                        />
                      </>
                    )}
                  />
                  <Controller
                    control={control}
                    name="incline"
                    render={({ field: { value, ...field } }) => (
                      <Select
                        label="ウマ"
                        classNames={{
                          base: "items-center",
                          label: "shrink-0 basis-14",
                          mainWrapper: "w-full",
                        }}
                        labelPlacement="outside-left"
                        disallowEmptySelection
                        selectedKeys={[value]}
                        {...field}
                        errorMessage={errors?.calcMethod}
                      >
                        {Object.entries(inclineOption).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  {incline === "custom" && (
                    <div className="flex items-center">
                      <div className="shrink-0 basis-14"></div>
                      <div>
                        <div className="flex items-center gap-1">
                          <Controller
                            control={control}
                            name="customIncline.incline1"
                            render={({ field }) => (
                              <Input
                                type="number"
                                label="1着"
                                placeholder="10"
                                {...field}
                              />
                            )}
                          />
                          <span>-</span>
                          <Controller
                            control={control}
                            name="customIncline.incline2"
                            render={({ field }) => (
                              <Input
                                type="number"
                                label="2着"
                                placeholder={playersCount === "4" ? "5" : "0"}
                                {...field}
                              />
                            )}
                          />
                          <span>-</span>
                          <Controller
                            control={control}
                            name="customIncline.incline3"
                            render={({ field }) => (
                              <Input
                                type="number"
                                label="3着"
                                placeholder={
                                  playersCount === "4" ? "-5" : "-10"
                                }
                                {...field}
                              />
                            )}
                          />
                          {playersCount === "4" && <span>-</span>}
                          <Controller
                            control={control}
                            name="customIncline.incline4"
                            render={({ field }) => (
                              <Input
                                className={classNames({
                                  hidden: playersCount === "3",
                                })}
                                hidden={playersCount === "3"}
                                type="number"
                                label="4着"
                                placeholder="-10"
                                {...field}
                              />
                            )}
                          />
                        </div>
                        {/* same as Input component error */}
                        {errors?.customIncline && (
                          <div className="px-1 pt-1 text-tiny text-danger">
                            {errors?.customIncline[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* <Controller
                    control={control}
                    name="rate"
                    render={({ field }) => (
                      <Input
                        classNames={{
                          label: "shrink-0 basis-14",
                          mainWrapper: "w-full",
                        }}
                        type="number"
                        label="レート"
                        labelPlacement="outside-left"
                        description="5: テンゴ、10: テンピン"
                        errorMessage={errors?.rate}
                        {...field}
                      />
                    )}
                  /> */}

                  <Controller
                    control={control}
                    name="chipRate"
                    render={({ field }) => (
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
                            <span className="text-small text-default-400">
                              円
                            </span>
                          </div>
                        }
                        errorMessage={errors?.chipRate}
                        {...field}
                      />
                    )}
                  />
                  <Accordion isCompact className="px-0" keepContentMounted>
                    <AccordionItem
                      title="詳細設定"
                      hideIndicator
                      classNames={{
                        titleWrapper: "text-right",
                        title: "text-small text-primary",
                      }}
                    >
                      <div className="space-y-3 px-1">
                        <Controller
                          control={control}
                          name="crackBoxBonus"
                          render={({ field }) => (
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
                              errorMessage={errors?.crackBoxBonus}
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="defaultPoints"
                          render={({ field }) => (
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
                              errorMessage={errors?.defaultPoints}
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="defaultCalcPoints"
                          render={({ field }) => (
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
                              errorMessage={errors?.defaultCalcPoints}
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="calcMethod"
                          render={({ field: { value, ...field } }) => (
                            <Select
                              classNames={{
                                base: "items-center",
                                label: "shrink-0 basis-14",
                                mainWrapper: "w-full",
                              }}
                              label="計算"
                              labelPlacement="outside-left"
                              disallowEmptySelection
                              selectedKeys={[value]}
                              {...field}
                              errorMessage={errors?.calcMethod}
                            >
                              {Object.entries(calcMethod).map(
                                ([key, value]) => (
                                  <SelectItem key={key} value={value}>
                                    {value}
                                  </SelectItem>
                                ),
                              )}
                            </Select>
                          )}
                        />
                      </div>
                    </AccordionItem>
                  </Accordion>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onClick={onClose}>
                    キャンセル
                  </Button>
                  <Button color="primary" type="submit">
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
