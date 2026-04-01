"use client";

import { FormProvider, useForm } from "@conform-to/react/future";
import { Drawer } from "@heroui/react";
import { Activity, useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Stepper } from "@/components/stepper";
import type { Profile } from "@/lib/type";
import { createSubmitHandler } from "@/lib/utils/form";
import { PlayerForm } from "./player-form";
import { createMatch } from "./player-form/actions";
import { playerStepSchema } from "./player-form/schema";
import { RuleForm } from "./rule-form";
import { parseRuleFormSubmission } from "./rule-form/actions";
import {
  playersCount4DefaultValues,
  type RuleOutput,
  ruleSchema,
} from "./rule-form/schema";

const steps = [{ title: "ルール設定" }, { title: "プレイヤー選択" }];

export function CreateMatchDrawer({
  isOpen,
  onOpenChange,
  userProfile,
  friends,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userProfile: Profile;
  friends: Profile[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ruleData, setRuleData] = useState<RuleOutput | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>([
    userProfile,
  ]);

  function handleRuleSubmit(formData: FormData) {
    setRuleData(parseRuleFormSubmission(formData));
    setCurrentStep(1);
  }

  const { form: ruleForm, intent: ruleIntent } = useForm(ruleSchema, {
    defaultValue: playersCount4DefaultValues,
    onSubmit: createSubmitHandler(handleRuleSubmit),
    shouldRevalidate: "onInput",
  });

  const [lastResult, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      if (ruleData === null) {
        return null;
      }
      return createMatch(ruleData, prevState, formData);
    },
    null,
  );

  const { form: playerForm } = useForm(playerStepSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    shouldRevalidate: "onInput",
  });

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      setCurrentStep(0);
      setRuleData(null);
      setSelectedPlayers([userProfile]);
      ruleIntent.reset();
    }
  }

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content>
        <Drawer.Dialog className="h-[85dvh]" aria-label="ゲーム作成">
          <Stepper steps={steps} currentStep={currentStep} className="mb-5" />

          <Drawer.Body>
            <Activity mode={currentStep === 0 ? "visible" : "hidden"}>
              <FormProvider context={ruleForm.context}>
                <Form
                  className="contents"
                  validationErrors={ruleForm.fieldErrors}
                  {...ruleForm.props}
                >
                  <div className="space-y-4">
                    <RuleForm />
                  </div>
                </Form>
              </FormProvider>
            </Activity>
            <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
              <FormProvider context={playerForm.context}>
                <Form
                  className="contents"
                  validationErrors={playerForm.fieldErrors}
                  {...playerForm.props}
                >
                  <PlayerForm
                    friends={friends}
                    selectedPlayers={selectedPlayers}
                    onSelectedPlayersChange={setSelectedPlayers}
                  />
                </Form>
              </FormProvider>
            </Activity>
          </Drawer.Body>

          <Drawer.Footer>
            {currentStep === 0 ? (
              <>
                <Button variant="ghost" slot="close">
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  form={ruleForm.props.id}
                >
                  プレイヤー選択へ
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onPress={() => setCurrentStep(0)}>
                  戻る
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  form={playerForm.props.id}
                  isPending={isPending}
                >
                  ゲーム開始
                </Button>
              </>
            )}
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
