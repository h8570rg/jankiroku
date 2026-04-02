"use client";

import {
  getFieldValue,
  parseSubmission,
  useForm,
  useFormData,
} from "@conform-to/react/future";
import {
  cn,
  Description,
  Disclosure,
  Drawer,
  FieldError,
  FieldGroup,
  Fieldset,
  Input,
  InputGroup,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  TextField,
  tv,
} from "@heroui/react";
import { useRef } from "react";
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
import {
  playersCount3DefaultValues,
  playersCount4DefaultValues,
  type RuleOutput,
  ruleSchema,
} from "./schema";

const optionCard = tv({
  base: [
    "m-0 flex h-12 items-center rounded-xl border",
    "border-border bg-surface px-2 transition-all",
    "data-[selected=true]:border-accent",
    "data-[selected=true]:bg-accent/10",
  ],
});

export function RuleForm({
  onSubmit,
}: {
  onSubmit: (ruleData: RuleOutput) => void;
}) {
  const { form, fields, intent } = useForm(ruleSchema, {
    defaultValue: playersCount4DefaultValues,
    onSubmit: createSubmitHandler((formData) => {
      onSubmit(ruleSchema.parse(parseSubmission(formData).payload));
    }),
    shouldRevalidate: "onInput",
  });

  const inclineField = fields.incline.getFieldset();
  const customInclineField = inclineField.custom.getFieldset();
  const chipRateField = fields.chipRate.getFieldset();

  const playersCount = useFormData(form.id, (fd) =>
    getFieldValue(fd, "playersCount", { type: "string" }),
  );
  const inclinePreset = useFormData(form.id, (fd) =>
    getFieldValue(fd, "incline.presets", { type: "string" }),
  );
  const chipRatePreset = useFormData(form.id, (fd) =>
    getFieldValue(fd, "chipRate.preset", { type: "string" }),
  );

  const isCustomIncline = inclinePreset === "custom";
  const isCustomChipRate = chipRatePreset === "custom";

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

  const chipRatePresetOptions = chipRatePresets.map((preset) => ({
    value: preset,
    label: chipRatePresetLabel[preset],
  }));

  const disclosureContentRef = useRef<HTMLDivElement>(null);

  function handlePlayersCountChange(value: string) {
    intent.reset({
      defaultValue:
        value === "4" ? playersCount4DefaultValues : playersCount3DefaultValues,
    });
  }

  return (
    <Form
      className="contents"
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <Drawer.Body>
        <div className="space-y-4">
          <RadioGroup
            name={fields.playersCount.name}
            defaultValue={fields.playersCount.defaultValue}
            variant="secondary"
            orientation="horizontal"
            onChange={handlePlayersCountChange}
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
                <Radio key={rate} value={String(rate)} className={optionCard()}>
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
              name={inclineField.presets.name}
              defaultValue={inclineField.presets.defaultValue}
            >
              <Label className="mb-3">ウマ</Label>
              <div className="grid grid-cols-2 gap-2">
                {inclinePresetOptions.map((opt) => (
                  <Radio
                    key={opt.value}
                    value={opt.value}
                    className={optionCard()}
                  >
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <Radio.Content>
                      <Label>{opt.label}</Label>
                      {opt.inclineValues && (
                        <Description className="text-[10px]">
                          {opt.inclineValues.join(", ")}
                        </Description>
                      )}
                    </Radio.Content>
                  </Radio>
                ))}
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
                  name={customInclineField.incline1.name}
                  defaultValue={customInclineField.incline1.defaultValue}
                >
                  <Label>1着</Label>
                  <Input placeholder="0" />
                  <FieldError />
                </TextField>
                <TextField
                  type="number"
                  variant="secondary"
                  name={customInclineField.incline2.name}
                  defaultValue={customInclineField.incline2.defaultValue}
                >
                  <Label>2着</Label>
                  <Input placeholder="0" />
                  <FieldError />
                </TextField>
                <TextField
                  type="number"
                  variant="secondary"
                  name={customInclineField.incline3.name}
                  defaultValue={customInclineField.incline3.defaultValue}
                >
                  <Label>3着</Label>
                  <Input placeholder="0" />
                  <FieldError />
                </TextField>
                <TextField
                  className={cn({ hidden: playersCount === "3" })}
                  type="number"
                  variant="secondary"
                  name={customInclineField.incline4.name}
                  defaultValue={customInclineField.incline4.defaultValue}
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
              name={chipRateField.preset.name}
              defaultValue={chipRateField.preset.defaultValue}
            >
              <Label className="mb-3">チップ</Label>
              <div className="grid grid-cols-2 gap-2">
                {chipRatePresetOptions.map((opt) => (
                  <Radio
                    key={opt.value}
                    value={opt.value}
                    className={optionCard()}
                  >
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <Radio.Content>
                      <Label>{opt.label}</Label>
                    </Radio.Content>
                  </Radio>
                ))}
              </div>
            </RadioGroup>
            <TextField
              className={cn("mt-2", { hidden: !isCustomChipRate })}
              type="number"
              variant="secondary"
              name={chipRateField.custom.name}
              defaultValue={chipRateField.custom.defaultValue}
            >
              <Label>カスタム</Label>
              <InputGroup>
                <InputGroup.Input placeholder="0" />
                <InputGroup.Suffix>円</InputGroup.Suffix>
              </InputGroup>
              <FieldError />
            </TextField>
          </div>

          <Disclosure>
            <Disclosure.Heading className="flex justify-end">
              <Button
                slot="trigger"
                size="sm"
                variant="outline"
                onPress={() => {
                  setTimeout(() => {
                    disclosureContentRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    });
                  }, 150);
                }}
              >
                詳細設定
                <Disclosure.Indicator />
              </Button>
            </Disclosure.Heading>
            <Disclosure.Content ref={disclosureContentRef}>
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
            </Disclosure.Content>
          </Disclosure>
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button variant="ghost" slot="close">
          キャンセル
        </Button>
        <Button variant="primary" type="submit">
          プレイヤー選択へ
        </Button>
      </Drawer.Footer>
    </Form>
  );
}
