"use client";

import { useForm, useFormData } from "@conform-to/react/future";
import { cn } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useActionState, useRef } from "react";
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
import { createSubmitHandler } from "@/lib/utils/form";
import { createMatch } from "./actions";
import { type CreateMatchInput, createMatchSchema } from "./schema";

const playersCount4DefaultValues: CreateMatchInput = {
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

const playersCount3DefaultValues: CreateMatchInput = {
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
  const formRef = useRef<HTMLFormElement>(null);

  const [lastResult, formAction, isPending] = useActionState(createMatch, null);

  const { form, fields, intent } = useForm(createMatchSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    defaultValue: playersCount4DefaultValues,
  });

  const playersCount = useFormData(
    formRef,
    (fd) => fd?.get("playersCount") ?? "4",
    { fallback: "4" },
  );
  const incline = useFormData(
    formRef,
    (fd) => fd?.get("incline") ?? "0_0_0_0",
    { fallback: "0_0_0_0" },
  );
  const inclineOption =
    playersCount === "4" ? inclineFor4PlayersLabel : inclineFor3PlayersLabel;

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
                ref={formRef}
                className="space-y-4"
                validationErrors={form.fieldErrors}
                {...form.props}
              >
                <ButtonGroup fullWidth>
                  <Button
                    variant={playersCount === "4" ? "primary" : "secondary"}
                    type="button"
                    onPress={() => {
                      intent.reset({
                        defaultValue: playersCount4DefaultValues,
                      });
                    }}
                  >
                    四麻
                  </Button>
                  <Button
                    variant={playersCount === "3" ? "primary" : "secondary"}
                    type="button"
                    onPress={() => {
                      intent.reset({
                        defaultValue: playersCount3DefaultValues,
                      });
                    }}
                  >
                    三麻
                  </Button>
                </ButtonGroup>
                <input
                  type="hidden"
                  name={fields.playersCount.name}
                  value={playersCount}
                />
                <Slider
                  label="レート"
                  name={fields.rate.name}
                  maxValue={rates.length - 1}
                  outputProps={{
                    children: ({ state }) =>
                      rateLabel[rates[Number(state.values)]],
                  }}
                  defaultValue={0}
                />
                <Slider
                  label="チップ"
                  name={fields.chipRate.name}
                  maxValue={chipRates.length - 1}
                  outputProps={{
                    children: ({ state }) =>
                      chipRateLabel[chipRates[Number(state.values)]],
                  }}
                  defaultValue={0}
                />
                <Select
                  label="ウマ"
                  variant="secondary"
                  name={fields.incline.name}
                  items={Object.entries(inclineOption).map(([key, value]) => ({
                    key,
                    label: value,
                  }))}
                  defaultValue={incline}
                />
                {incline === "custom" &&
                  (() => {
                    const customInclineFields =
                      fields.customIncline.getFieldset();
                    return (
                      <div className="py-2">
                        <div
                          className="
                          flex gap-1
                          *:min-w-0
                        "
                        >
                          <TextField
                            type="number"
                            label="1着"
                            placeholder="10"
                            variant="secondary"
                            name={customInclineFields.incline1.name}
                          />
                          <TextField
                            type="number"
                            label="2着"
                            placeholder={playersCount === "4" ? "5" : "0"}
                            variant="secondary"
                            name={customInclineFields.incline2.name}
                          />
                          <TextField
                            type="number"
                            label="3着"
                            placeholder={playersCount === "4" ? "-5" : "-10"}
                            variant="secondary"
                            name={customInclineFields.incline3.name}
                          />
                          <TextField
                            className={cn({
                              hidden: playersCount === "3",
                            })}
                            type="number"
                            label="4着"
                            placeholder="-10"
                            variant="secondary"
                            name={customInclineFields.incline4.name}
                          />
                        </div>
                        {form.fieldErrors?.customIncline?.[0] && (
                          <p className="text-sm text-danger">
                            {form.fieldErrors.customIncline[0]}
                          </p>
                        )}
                      </div>
                    );
                  })()}
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
                        <TextField
                          type="number"
                          label="飛び賞"
                          variant="secondary"
                          suffix="点"
                          name={fields.crackBoxBonus.name}
                          defaultValue={fields.crackBoxBonus.defaultValue}
                        />
                        <TextField
                          type="number"
                          label="持ち点"
                          variant="secondary"
                          suffix="点"
                          name={fields.defaultPoints.name}
                          defaultValue={fields.defaultPoints.defaultValue}
                        />
                        <TextField
                          type="number"
                          label="オカ"
                          variant="secondary"
                          suffix="点"
                          name={fields.defaultCalcPoints.name}
                          defaultValue={fields.defaultCalcPoints.defaultValue}
                        />
                        <Select
                          label="計算"
                          variant="secondary"
                          name={fields.calcMethod.name}
                          items={calcMethods.map((calcMethod) => ({
                            key: calcMethod,
                            label: calcMethodLabel[calcMethod],
                          }))}
                          defaultValue={fields.calcMethod.defaultValue}
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
                form={form.props.id}
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
