"use client";

import { Drawer } from "@heroui/react";
import { Activity, useState } from "react";
import { Stepper } from "@/components/stepper";
import type { Profile } from "@/lib/type";
import { PlayerForm } from "./player-form";
import { RuleForm } from "./rule-form";
import type { RuleOutput } from "./rule-form/schema";

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

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      setCurrentStep(0);
      setRuleData(null);
    }
  }

  function handleRuleSubmit(data: RuleOutput) {
    setRuleData(data);
    setCurrentStep(1);
  }

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content>
        <Drawer.Dialog className="h-[85dvh]" aria-label="ゲーム作成">
          <Stepper steps={steps} currentStep={currentStep} className="mb-2" />
          <Activity mode={currentStep === 0 ? "visible" : "hidden"}>
            <RuleForm onSubmit={handleRuleSubmit} />
          </Activity>
          <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
            {ruleData && (
              <PlayerForm
                ruleData={ruleData}
                userProfile={userProfile}
                friends={friends}
                onBack={() => setCurrentStep(0)}
              />
            )}
          </Activity>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
