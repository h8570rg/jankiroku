"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/Button";
import { Card, CardBody } from "~/components/Card";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/Popover";
import { Progress } from "~/components/Progress";
import { User } from "~/components/User";
import {
  ProfileUpdateSchema,
  profileUpdateSchema,
  useProfileUpdate,
} from "~/lib/hooks/api/profile";
import { useProfileExists } from "~/lib/hooks/api/profiles";

const janrecoIdSchema = profileUpdateSchema.pick({ janrecoId: true });
type JanrecoIdSchema = z.infer<typeof janrecoIdSchema>;
const nameSchema = profileUpdateSchema.pick({ name: true });
type NameSchema = z.infer<typeof nameSchema>;

export default function ProfileForm({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const progress = (100 / 3) * step;

  const [janrecoId, setJanrecoId] =
    useState<ProfileUpdateSchema["janrecoId"]>();
  const [name, setName] = useState<ProfileUpdateSchema["name"]>();

  const { trigger: getProfileExists } = useProfileExists();

  const { trigger: updateProfile, isMutating: isUpdatingProfile } =
    useProfileUpdate({ profileId: userId });

  const janrecoIdForm = useForm<JanrecoIdSchema>({
    resolver: zodResolver(janrecoIdSchema),
    mode: "onChange",
  });

  const onJanrecoIdSubmit: SubmitHandler<JanrecoIdSchema> = async (data) => {
    const exists = await getProfileExists({ janrecoId: data.janrecoId });
    if (exists) {
      janrecoIdForm.setError("janrecoId", {
        type: "manual",
        message: "このIDは既に使用されています",
      });
      return;
    }
    setJanrecoId(data.janrecoId);
    setStep((prev) => prev + 1);
  };

  const nameForm = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    mode: "onChange",
  });

  const onNameSubmit: SubmitHandler<NameSchema> = async (data) => {
    setName(data.name);
    setStep((prev) => prev + 1);
  };

  const handleConfirmClick = useCallback(async () => {
    if (!janrecoId || !name) {
      return;
    }
    await updateProfile({ janrecoId, name });
    router.push("/");
  }, [janrecoId, name, router, updateProfile]);

  const handlePrevClick = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  return (
    <div className={classNames("flex flex-col px-4 pt-4 pb-16", className)}>
      <Progress className="mb-10" label={`STEP: ${step}`} value={progress} />
      <div className="flex grow items-center">
        <div className="w-full">
          {/* janrecoIdForm */}
          {step === 1 && (
            <form onSubmit={janrecoIdForm.handleSubmit(onJanrecoIdSubmit)}>
              <div className="mb-10 flex items-center justify-center gap-0.5">
                <p className="text-center font-bold">
                  ユーザーIDを決めてください
                </p>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="light" size="sm" isIconOnly>
                      <Icon className="h-5 w-5 fill-current" name="help" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="w-[300px] p-2 text-sm">
                      ユーザーIDは、他のユーザーがあなたを検索するために使用されます。あとから変更することも可能です。
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-6">
                <Input
                  type="text"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-sm text-default-400">@</span>
                    </div>
                  }
                  description="半角英数字4~12文字で入力してください"
                  maxLength={12}
                  {...janrecoIdForm.register("janrecoId")}
                  errorMessage={
                    janrecoIdForm.formState.errors.janrecoId?.message
                  }
                  autoFocus
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    color="primary"
                    isDisabled={!janrecoIdForm.formState.isValid}
                    isLoading={janrecoIdForm.formState.isSubmitting}
                  >
                    次へ
                  </Button>
                </div>
              </div>
            </form>
          )}
          {/* nameForm */}
          {step === 2 && (
            <form onSubmit={nameForm.handleSubmit(onNameSubmit)}>
              <div className="mb-10 flex items-center justify-center gap-0.5">
                <p className="text-center font-bold">名前を決めてください</p>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="light" size="sm" isIconOnly>
                      <Icon className="h-5 w-5 fill-current" name="help" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="w-[300px] p-2 text-sm">
                      名前は成績表に表示されます。あとから変更することも可能です。
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-6">
                <Input
                  type="text"
                  description="10文字以内で入力してください"
                  maxLength={10}
                  {...nameForm.register("name")}
                  errorMessage={nameForm.formState.errors.name?.message}
                  autoFocus
                />
                <div className="flex justify-end">
                  <Button variant="light" onClick={handlePrevClick}>
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    isDisabled={!nameForm.formState.isValid}
                  >
                    次へ
                  </Button>
                </div>
              </div>
            </form>
          )}
          {/* confirm */}
          {step === 3 && !!name && !!janrecoId && (
            <>
              <div className="mb-6">
                <p className="text-center font-bold">
                  こちらでよろしいですか？
                </p>
                <p className="mt-2 text-center text-xs text-foreground-500">
                  あとから変更できます
                </p>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardBody>
                    <div>
                      <User name={name} janrecoId={janrecoId} />
                    </div>
                  </CardBody>
                </Card>
                <div className="flex justify-end">
                  <Button variant="light" onClick={handlePrevClick}>
                    戻る
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleConfirmClick}
                    isLoading={isUpdatingProfile}
                  >
                    始める
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
