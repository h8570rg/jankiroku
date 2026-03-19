"use client";

import { getFieldValue, useForm, useFormData } from "@conform-to/react/future";
import {
  Accordion,
  cn,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Input,
  InputGroup,
  Label,
  ListBox,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  tv,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useActionState, useRef } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import {
  calcMethodLabel,
  calcMethods,
  chipRatePresetLabel,
  chipRatePresets,
  inclinePresetLabelFor3Players,
  inclinePresetLabelFor4Players,
  inclinePresetValuesFor3Players,
  inclinePresetValuesFor4Players,
  inclinesPresetsFor3Players,
  inclinesPresetsFor4Players,
  rateDescription,
  rateLabel,
  rates,
} from "@/lib/config";
import { createSubmitHandler } from "@/lib/utils/form";
import { createMatch } from "./actions";
import { type CreateMatchInput, createMatchSchema } from "./schema";

const optionCard = tv({
  base: [
    "m-0 flex h-12 items-center rounded-xl border",
    "border-border bg-surface px-2 transition-all",
    "data-[selected=true]:border-accent",
    "data-[selected=true]:bg-accent/10",
  ],
});

const playersCount4DefaultValues: CreateMatchInput = {
  playersCount: "4",
  incline: {
    presets: "0_0_0_0",
  },
  crackBoxBonus: "10000",
  defaultPoints: "25000",
  defaultCalcPoints: "30000",
  calcMethod: "round",
  rate: "0",
  chipRate: {
    preset: "0",
  },
};

const playersCount3DefaultValues: CreateMatchInput = {
  playersCount: "3",
  incline: {
    presets: "0_0_0_0",
  },
  crackBoxBonus: "10000",
  defaultPoints: "35000",
  defaultCalcPoints: "40000",
  calcMethod: "round",
  rate: "0",
  chipRate: {
    preset: "0",
  },
};

export function CreateMatchModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [lastResult, formAction, isPending] = useActionState(createMatch, null);

  const { form, fields, intent } = useForm(createMatchSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    defaultValue: playersCount4DefaultValues,
  });

  // fieldset
  const inclineFieldset = fields.incline.getFieldset();
  const customInclineFieldset = inclineFieldset.custom.getFieldset();
  const chipRateFieldset = fields.chipRate.getFieldset();

  // field data
  const playersCount = useFormData(formRef, (fd) =>
    getFieldValue(fd, fields.playersCount.name, { type: "string" }),
  );
  const inclinePreset = useFormData(formRef, (fd) =>
    getFieldValue(fd, inclineFieldset.presets.name, { type: "string" }),
  );
  const chipRatePreset = useFormData(formRef, (fd) =>
    getFieldValue(fd, chipRateFieldset.preset.name, { type: "string" }),
  );

  // field state
  const isCustomIncline = inclinePreset === "custom";
  const isCustomChipRate = chipRatePreset === "custom";

  // options
  const inclinePresetOptions =
    playersCount === "4"
      ? inclinesPresetsFor4Players.map((i) => ({
          value: i,
          label: inclinePresetLabelFor4Players[i],
          inclineValues: inclinePresetValuesFor4Players[i],
        }))
      : inclinesPresetsFor3Players.map((i) => ({
          value: i,
          label: inclinePresetLabelFor3Players[i],
          inclineValues: inclinePresetValuesFor3Players[i],
        }));
  const chipRatePresetOptions = chipRatePresets.map((chipRatePreset) => ({
    value: chipRatePreset,
    label: chipRatePresetLabel[chipRatePreset],
  }));

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        {/* position:relative + overflow:hidden がブラウザの layout boundary 最適化を誤発火させ、
            コンテンツ高さの変化時に親 flex の mt-auto が再計算されず隙間が出るため static で上書き */}
        <Modal.Dialog className="static">
          <Modal.Header>
            <Modal.Heading>ゲーム作成</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="pt-4 -mx-1">
            <Form
              key={form.key}
              ref={formRef}
              className="space-y-4 px-1"
              validationErrors={form.fieldErrors}
              {...form.props}
            >
              <RadioGroup
                name={fields.playersCount.name}
                defaultValue={fields.playersCount.defaultValue}
                variant="secondary"
                orientation="horizontal"
                onChange={(value) => {
                  intent.reset({
                    defaultValue:
                      value === "4"
                        ? playersCount4DefaultValues
                        : playersCount3DefaultValues,
                  });
                }}
              >
                <Label>プレイ人数</Label>
                {[
                  { value: "4", label: "四麻" },
                  { value: "3", label: "三麻" },
                ].map(({ value, label }) => (
                  <Radio key={value} value={value}>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <Radio.Content>
                      <Label>{label}</Label>
                    </Radio.Content>
                  </Radio>
                ))}
              </RadioGroup>
              <RadioGroup
                name={fields.rate.name}
                defaultValue={fields.rate.defaultValue}
                variant="secondary"
              >
                <Label className="mb-3">レート</Label>
                <div className="grid grid-cols-2 gap-2">
                  {rates.map((rate) => (
                    <Radio
                      key={rate}
                      value={String(rate)}
                      className={optionCard()}
                    >
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <Label>{rateLabel[rate]}</Label>
                        {rateDescription[rate] && (
                          <Description className="text-[10px]">
                            {rateDescription[rate]}
                          </Description>
                        )}
                      </Radio.Content>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
              <div>
                <RadioGroup
                  variant="secondary"
                  name={inclineFieldset.presets.name}
                  defaultValue={inclineFieldset.presets.defaultValue}
                >
                  <Label className="mb-3">ウマ</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {inclinePresetOptions.map((inclinePresetOption) => {
                      return (
                        <Radio
                          key={inclinePresetOption.value}
                          value={inclinePresetOption.value}
                          className={optionCard()}
                        >
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          <Radio.Content>
                            <Label>{inclinePresetOption.label}</Label>
                            {inclinePresetOption.inclineValues && (
                              <Description className="text-[10px]">
                                {inclinePresetOption.inclineValues.join(", ")}
                              </Description>
                            )}
                          </Radio.Content>
                        </Radio>
                      );
                    })}
                  </div>
                </RadioGroup>
                <Fieldset
                  className={cn("mt-2 min-w-0 gap-0", {
                    hidden: !isCustomIncline,
                  })}
                >
                  <FieldGroup
                    className="
                      flex gap-1
                      *:mb-0 *:min-w-0 *:flex-1
                    "
                  >
                    <TextField
                      type="number"
                      variant="secondary"
                      name={customInclineFieldset.incline1.name}
                      defaultValue={customInclineFieldset.incline1.defaultValue}
                    >
                      <Label>1着</Label>
                      <Input placeholder="0" />
                      <FieldError />
                    </TextField>
                    <TextField
                      type="number"
                      variant="secondary"
                      name={customInclineFieldset.incline2.name}
                      defaultValue={customInclineFieldset.incline2.defaultValue}
                    >
                      <Label>2着</Label>
                      <Input placeholder="0" />
                      <FieldError />
                    </TextField>
                    <TextField
                      type="number"
                      variant="secondary"
                      name={customInclineFieldset.incline3.name}
                      defaultValue={customInclineFieldset.incline3.defaultValue}
                    >
                      <Label>3着</Label>
                      <Input placeholder="0" />
                      <FieldError />
                    </TextField>
                    <TextField
                      className={cn({ hidden: playersCount === "3" })}
                      type="number"
                      variant="secondary"
                      name={customInclineFieldset.incline4.name}
                      defaultValue={customInclineFieldset.incline4.defaultValue}
                    >
                      <Label>4着</Label>
                      <Input placeholder="0" />
                      <FieldError />
                    </TextField>
                  </FieldGroup>
                  {fields.incline.errors && (
                    <p className="mt-2 text-sm text-danger">
                      {fields.incline.errors}
                    </p>
                  )}
                </Fieldset>
              </div>
              <div>
                <RadioGroup
                  variant="secondary"
                  name={chipRateFieldset.preset.name}
                  defaultValue={chipRateFieldset.preset.defaultValue}
                >
                  <Label className="mb-3">チップ</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {chipRatePresetOptions.map((chipRatePresetOption) => (
                      <Radio
                        key={chipRatePresetOption.value}
                        value={chipRatePresetOption.value}
                        className={optionCard()}
                      >
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <Radio.Content>
                          <Label>{chipRatePresetOption.label}</Label>
                        </Radio.Content>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
                <TextField
                  className={cn("mt-2", { hidden: !isCustomChipRate })}
                  type="number"
                  variant="secondary"
                  name={chipRateFieldset.custom.name}
                  defaultValue={chipRateFieldset.custom.defaultValue}
                >
                  <Label>カスタム</Label>
                  <InputGroup>
                    <InputGroup.Input placeholder="0" />
                    <InputGroup.Suffix>円</InputGroup.Suffix>
                  </InputGroup>
                  <FieldError />
                </TextField>
              </div>
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
  );
}
