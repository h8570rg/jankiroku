"use client";

import { ChevronDown } from "@gravity-ui/icons";
import { cn, ErrorMessage } from "@heroui/react";
import { useActionState, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { Accordion } from "@/components/accordion";
import { Button, ButtonGroup } from "@/components/button";
import { Form } from "@/components/form";
import { Modal, useOverlayState } from "@/components/modal";
import { Select } from "@/components/select";
import { Slider } from "@/components/slider";
import { TextField } from "@/components/text-field";
import {
  calcMethodLabel,
  calcMethods,
  chipRateLabel,
  chipRates,
  inclineFor3PlayersLabel,
  inclineFor4PlayersLabel,
  rateLabel,
  rates,
} from "@/lib/config";
import { createMatch, type InputSchema } from "./actions";

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
  chipRate: "0",
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
  chipRate: "0",
};

export function CreateMatchButton({ className }: { className?: string }) {
  const ruleCreateModal = useOverlayState();

  const [state, formAction, isPending] = useActionState(createMatch, {});
  const { errors } = state;

  const { reset, control, watch } = useForm<InputSchema>({
    defaultValues: playersCount4DefaultValues,
  });

  const playersCount = watch("playersCount");
  const incline = watch("incline");
  const inclineOption =
    playersCount === "4" ? inclineFor4PlayersLabel : inclineFor3PlayersLabel;

  const formId = useId();

  console.debug(errors);

  return (
    <>
      <Button
        className={className}
        size="lg"
        variant="primary"
        onPress={ruleCreateModal.open}
      >
        ゲームを始める
      </Button>
      <Modal.Backdrop
        isOpen={ruleCreateModal.isOpen}
        onOpenChange={ruleCreateModal.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>ルール設定</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Form
                className="space-y-4"
                id={formId}
                action={formAction}
                validationErrors={errors}
              >
                <Controller
                  control={control}
                  name="playersCount"
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <ButtonGroup fullWidth>
                        <Button
                          variant={value === "4" ? "primary" : "secondary"}
                          onPress={() => {
                            onChange("4");
                            reset(playersCount4DefaultValues);
                          }}
                        >
                          四麻
                        </Button>
                        <Button
                          variant={value === "3" ? "primary" : "secondary"}
                          onPress={() => {
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
                    <Slider
                      label="レート"
                      maxValue={rates.length - 1}
                      outputProps={{
                        children: ({ state }) =>
                          rateLabel[rates[Number(state.values)]],
                      }}
                      onChange={(v) => {
                        onChange(String(v));
                      }}
                      value={Number(value)}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="chipRate"
                  render={({ field: { onChange, value, ...field } }) => (
                    <Slider
                      label="チップ"
                      maxValue={chipRates.length - 1}
                      outputProps={{
                        children: ({ state }) =>
                          chipRateLabel[chipRates[Number(state.values)]],
                      }}
                      onChange={(v) => {
                        onChange(String(v));
                      }}
                      value={Number(value)}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="incline"
                  render={({ field: { value, ...field } }) => (
                    <Select
                      label="ウマ"
                      variant="secondary"
                      items={Object.entries(inclineOption).map(
                        ([key, value]) => ({
                          key,
                          label: value,
                        }),
                      )}
                      defaultValue={value}
                      {...field}
                    />
                  )}
                />
                {incline === "custom" && (
                  <div className="py-2">
                    <div
                      className="
                        flex gap-1
                        *:min-w-0
                      "
                    >
                      <Controller
                        control={control}
                        name="customIncline.incline1"
                        render={({ field }) => (
                          <TextField
                            type="number"
                            label="1着"
                            placeholder="10"
                            variant="secondary"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="customIncline.incline2"
                        render={({ field }) => (
                          <TextField
                            type="number"
                            label="2着"
                            placeholder={playersCount === "4" ? "5" : "0"}
                            variant="secondary"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="customIncline.incline3"
                        render={({ field }) => (
                          <TextField
                            type="number"
                            label="3着"
                            placeholder={playersCount === "4" ? "-5" : "-10"}
                            variant="secondary"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="customIncline.incline4"
                        render={({ field }) => (
                          <TextField
                            className={cn({
                              hidden: playersCount === "3",
                            })}
                            hidden={playersCount === "3"}
                            type="number"
                            label="4着"
                            placeholder="-10"
                            variant="secondary"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <ErrorMessage>{errors?.customIncline?.[0]}</ErrorMessage>
                  </div>
                )}
                <Accordion>
                  <Accordion.Item>
                    <Accordion.Heading>
                      <Accordion.Trigger className="px-1">
                        詳細設定
                        <Accordion.Indicator>
                          <ChevronDown />
                        </Accordion.Indicator>
                      </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <div className="space-y-3 px-1">
                        <Controller
                          control={control}
                          name="crackBoxBonus"
                          render={({ field }) => (
                            <TextField
                              type="number"
                              label="飛び賞"
                              variant="secondary"
                              suffix="点"
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="defaultPoints"
                          render={({ field }) => (
                            <TextField
                              type="number"
                              label="持ち点"
                              variant="secondary"
                              suffix="点"
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="defaultCalcPoints"
                          render={({ field }) => (
                            <TextField
                              type="number"
                              label="オカ"
                              variant="secondary"
                              suffix="点"
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="calcMethod"
                          render={({ field: { value, ...field } }) => (
                            <Select
                              label="計算"
                              variant="secondary"
                              items={calcMethods.map((calcMethod) => ({
                                key: calcMethod,
                                label: calcMethodLabel[calcMethod],
                              }))}
                              defaultValue={value}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" slot="close">
                キャンセル
              </Button>
              <Button
                form={formId}
                variant="primary"
                type="submit"
                isPending={isPending}
              >
                開始
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
