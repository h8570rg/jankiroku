"use client";

import { FormProvider, useForm } from "@conform-to/react/future";
import { formatResult } from "@conform-to/zod/v4/future";
import { Drawer } from "@heroui/react";
import { Activity, startTransition, useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Stepper } from "@/components/stepper";
import type { Profile } from "@/lib/type";
import { createMatch } from "./actions";
import { PlayerStep } from "./player-step";
import { RuleStep } from "./rule-step";
import {
  createMatchSchema,
  playersCount4DefaultValues,
  ruleSchema,
} from "./schema";

const steps = [{ title: "ルール設定" }, { title: "プレイヤー選択" }];

export function CreateMatchDrawer({
  isOpen,
  onOpenChange,
  friends,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  friends: Profile[];
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const [lastResult, formAction, isPending] = useActionState(createMatch, null);

  const { form } = useForm(createMatchSchema, {
    lastResult,
    defaultValue: playersCount4DefaultValues,
    onValidate({ payload, formData }) {
      const step = formData.get("__step");
      const schema = step === "rule" ? ruleSchema : createMatchSchema;
      return formatResult(schema.safeParse(payload));
    },
    onSubmit(event, context) {
      event.preventDefault();
      const formData =
        context?.formData ?? new FormData(event.target as HTMLFormElement);
      if (formData.get("__step") === "rule") {
        setCurrentStep(1);
        return;
      }
      startTransition(() => formAction(formData));
    },
  });

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      setCurrentStep(0);
    }
  }

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content>
        <Drawer.Dialog className="h-[85dvh]">
          <Drawer.Header className="mb-5">
            <Stepper steps={steps} currentStep={currentStep} className="" />
          </Drawer.Header>

          <FormProvider context={form.context}>
            {/*
              conform の intent 送信（reset/update）は内部で requestSubmit() を使うが、
              useForm に schema を第1引数で渡しつつ onValidate も指定している場合、
              intent submission 時に syncResult / asyncResult が共に undefined になり
              conform 内部の preventDefault() が呼ばれない。
              その結果ブラウザが GET ナビゲーションを行い Drawer が閉じてしまう。
              これを回避するため、conform のハンドラ実行後に preventDefault を補完する。
            */}
            <Form
              className="contents"
              validationErrors={form.fieldErrors}
              {...form.props}
              onSubmit={(e) => {
                form.props.onSubmit?.(e);
                if (!e.defaultPrevented) {
                  e.preventDefault();
                }
              }}
            >
              <input
                type="hidden"
                name="__step"
                value={currentStep === 0 ? "rule" : "player"}
              />
              <Drawer.Body>
                <Activity mode={currentStep === 0 ? "visible" : "hidden"}>
                  <div className="space-y-4">
                    <RuleStep />
                  </div>
                </Activity>
                <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
                  <PlayerStep friends={friends} />
                </Activity>
              </Drawer.Body>

              <Drawer.Footer>
                {currentStep === 0 ? (
                  <>
                    <Button variant="ghost" slot="close">
                      キャンセル
                    </Button>
                    <Button variant="primary" type="submit">
                      次へ
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onPress={() => setCurrentStep(0)}>
                      戻る
                    </Button>
                    <Button
                      form={form.props.id}
                      variant="primary"
                      type="submit"
                      isPending={isPending}
                    >
                      開始
                    </Button>
                  </>
                )}
              </Drawer.Footer>
            </Form>
          </FormProvider>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
