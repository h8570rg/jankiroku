import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/Button";
import { FriendsList } from "~/components/FriendsList";
import { Input } from "~/components/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "~/components/Modal";
import { ProfilesSearch } from "~/components/ProfilesSearch";
import { ScrollShadow } from "~/components/ScrollShadow";
import { Tab, Tabs } from "~/components/Tabs";
import { useMatch, useMatchPlayerAdd } from "~/lib/hooks/api/match";
import { useProfileCreate } from "~/lib/hooks/api/profile";
import { Match } from "~/lib/services/match";
import { schemas } from "~/lib/utils/schemas";

const anonymousFormSchema = z.object({
  name: schemas.name,
});
type AnonymousFormSchema = z.infer<typeof anonymousFormSchema>;

export function MatchPlayerInputModal({
  match: defaultMatch,
  isOpen,
  onOpenChange,
  onClose,
}: {
  match: Match;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
}) {
  const { data: match } = useMatch(defaultMatch);
  const { trigger: addMatchPlayer } = useMatchPlayerAdd(match.id);
  const { trigger: createProfile } = useProfileCreate();

  const matchPlayerIds = match.players.map((player) => player.id);

  const anonymousForm = useForm<AnonymousFormSchema>({
    resolver: zodResolver(anonymousFormSchema),
    mode: "onChange",
  });

  const onAnonymousFormSubmit: SubmitHandler<AnonymousFormSchema> = async ({
    name,
  }) => {
    const anonymousProfile = await createProfile({ name });
    handlePlayerSelect(anonymousProfile.id);
  };

  const handlePlayerSelect = useCallback(
    async (profileId: string) => {
      await addMatchPlayer({ profileId });
      onClose();
    },
    [addMatchPlayer, onClose],
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        <ModalHeader>プレイヤー選択</ModalHeader>
        <ModalBody>
          <div>
            <Tabs fullWidth radius="lg" aria-label="プレイヤー選択の選択肢">
              <Tab key="friends" title="フレンド">
                <ScrollShadow className="h-[300px]">
                  <FriendsList
                    showMenu={false}
                    isSelectable={true}
                    onSelect={handlePlayerSelect}
                    excludeFriendIds={matchPlayerIds}
                  />
                </ScrollShadow>
              </Tab>
              <Tab key="profiles" title="ユーザー検索">
                <div className="flex h-[300px] flex-col">
                  <ProfilesSearch
                    listClassName="grow"
                    excludeProfileIds={matchPlayerIds}
                    onSelect={handlePlayerSelect}
                  />
                </div>
              </Tab>
              <Tab key="anonymous" title="一般">
                <div className="h-[300px]">
                  <form
                    onSubmit={anonymousForm.handleSubmit(onAnonymousFormSubmit)}
                  >
                    <Input
                      type="text"
                      placeholder="プレイヤー名を入力してください"
                      {...anonymousForm.register("name")}
                      errorMessage={
                        anonymousForm.formState.errors.name?.message
                      }
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="submit"
                        color="primary"
                        isLoading={anonymousForm.formState.isSubmitting}
                      >
                        決定
                      </Button>
                    </div>
                  </form>
                </div>
              </Tab>
            </Tabs>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
