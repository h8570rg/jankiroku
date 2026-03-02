"use client";

import { useForm, useFormData } from "@conform-to/react/future";
import {
  Accordion,
  cn,
  FieldError,
  Input,
  InputGroup,
  Label,
  ListBox,
  Modal,
  Select,
  Slider,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useActionState, useRef } from "react";
import { Button, ButtonGroup } from "@/components/button";
import { Form } from "@/components/form";
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
                <Slider maxValue={rates.length - 1} defaultValue={0}>
                  <Label>レート</Label>
                  <Slider.Output>
                    {({ state }) => rateLabel[rates[Number(state.values)]]}
                  </Slider.Output>
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb name={fields.rate.name} />
                  </Slider.Track>
                </Slider>
                <Slider maxValue={chipRates.length - 1} defaultValue={0}>
                  <Label>チップ</Label>
                  <Slider.Output>
                    {({ state }) =>
                      chipRateLabel[chipRates[Number(state.values)]]
                    }
                  </Slider.Output>
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb name={fields.chipRate.name} />
                  </Slider.Track>
                </Slider>
                <Select
                  variant="secondary"
                  name={fields.incline.name}
                  defaultValue={incline}
                >
                  <Label>ウマ</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {Object.entries(inclineOption).map(([key, value]) => (
                        <ListBox.Item key={key} id={key} textValue={value}>
                          {value}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError />
                </Select>
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
                            variant="secondary"
                            name={customInclineFields.incline1.name}
                          >
                            <Label>1着</Label>
                            <Input placeholder="10" />
                            <FieldError />
                          </TextField>
                          <TextField
                            type="number"
                            variant="secondary"
                            name={customInclineFields.incline2.name}
                          >
                            <Label>2着</Label>
                            <Input
                              placeholder={playersCount === "4" ? "5" : "0"}
                            />
                            <FieldError />
                          </TextField>
                          <TextField
                            type="number"
                            variant="secondary"
                            name={customInclineFields.incline3.name}
                          >
                            <Label>3着</Label>
                            <Input
                              placeholder={playersCount === "4" ? "-5" : "-10"}
                            />
                            <FieldError />
                          </TextField>
                          <TextField
                            className={cn({ hidden: playersCount === "3" })}
                            type="number"
                            variant="secondary"
                            name={customInclineFields.incline4.name}
                          >
                            <Label>4着</Label>
                            <Input placeholder="-10" />
                            <FieldError />
                          </TextField>
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
                          variant="secondary"
                          name={fields.crackBoxBonus.name}
                          defaultValue={fields.crackBoxBonus.defaultValue}
                        >
                          <Label>飛び賞</Label>
                          <InputGroup>
                            <InputGroup.Input />
                            <InputGroup.Suffix>点</InputGroup.Suffix>
                          </InputGroup>
                          <FieldError />
                        </TextField>
                        <TextField
                          type="number"
                          variant="secondary"
                          name={fields.defaultPoints.name}
                          defaultValue={fields.defaultPoints.defaultValue}
                        >
                          <Label>持ち点</Label>
                          <InputGroup>
                            <InputGroup.Input />
                            <InputGroup.Suffix>点</InputGroup.Suffix>
                          </InputGroup>
                          <FieldError />
                        </TextField>
                        <TextField
                          type="number"
                          variant="secondary"
                          name={fields.defaultCalcPoints.name}
                          defaultValue={fields.defaultCalcPoints.defaultValue}
                        >
                          <Label>オカ</Label>
                          <InputGroup>
                            <InputGroup.Input />
                            <InputGroup.Suffix>点</InputGroup.Suffix>
                          </InputGroup>
                          <FieldError />
                        </TextField>
                        <Select
                          variant="secondary"
                          name={fields.calcMethod.name}
                          defaultValue={fields.calcMethod.defaultValue}
                        >
                          <Label>計算</Label>
                          <Select.Trigger>
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              {calcMethods.map((calcMethod) => (
                                <ListBox.Item
                                  key={calcMethod}
                                  id={calcMethod}
                                  textValue={calcMethodLabel[calcMethod]}
                                >
                                  {calcMethodLabel[calcMethod]}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                          <FieldError />
                        </Select>
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
