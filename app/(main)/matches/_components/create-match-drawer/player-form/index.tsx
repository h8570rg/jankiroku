"use client";

import { useForm } from "@conform-to/react/future";
import {
  Avatar,
  CloseButton,
  Drawer,
  Header,
  ListBox,
  ScrollShadow,
  SearchField,
  Surface,
  useOverlayState,
} from "@heroui/react";
import { Check, User as UserIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { User } from "@/components/user";
import type { Profile } from "@/lib/type";
import { createSubmitHandler } from "@/lib/utils/form";
import type { RuleOutput } from "../rule-form/schema";
import { createMatch } from "./actions";
import { ProfileCreateModal } from "./profile-create-modal";
import { playerStepSchema } from "./schema";
import { searchProfiles } from "./search-profiles";

export function PlayerForm({
  ruleData,
  friends,
  defaultSelectedPlayers,
  onBack,
}: {
  ruleData: RuleOutput;
  friends: Profile[];
  defaultSelectedPlayers: Profile[];
  onBack: () => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>(
    defaultSelectedPlayers,
  );
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );
  const profileCreateModal = useOverlayState({ defaultOpen: false });

  const [lastResult, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return createMatch(ruleData, prevState, formData);
    },
    null,
  );

  const { form, fields } = useForm(playerStepSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    shouldRevalidate: "onInput",
  });

  const handleSearch = useDebouncedCallback((text: string) => {
    if (!text) {
      setSearchedProfiles(null);
      return;
    }
    searchProfiles(text)
      .then(setSearchedProfiles)
      .catch((e) => {
        throw e;
      });
  }, 300);

  function handleSelect(key: string | number) {
    if (key === "new") {
      profileCreateModal.open();
      return;
    }
    if (selectedPlayers.find((p) => p.id === key)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== key));
      return;
    }
    const allProfiles = searchedProfiles ?? friends;
    const player = allProfiles.find((p) => p.id === key);
    if (player) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  }

  function handleRemove(player: Profile) {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
  }

  return (
    <Form
      className="contents"
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <Drawer.Body>
        <div className="flex h-[60dvh] max-h-[500px] flex-col">
          {selectedPlayers.map((p) => (
            <input key={p.id} type="hidden" name="playerIds" value={p.id} />
          ))}
          {fields.playerIds.errors && (
            <p className="mb-2 text-sm text-danger">
              {fields.playerIds.errors}
            </p>
          )}

          {selectedPlayers.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 pl-1 text-xs text-muted">
                選択中 ({selectedPlayers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map((player) => (
                  <Surface
                    key={player.id}
                    variant="secondary"
                    className="basis-1/4 p-2 rounded-2xl border border-accent flex flex-col items-center gap-0"
                  >
                    <Avatar size="sm">
                      <Avatar.Fallback>
                        <UserIcon />
                      </Avatar.Fallback>
                    </Avatar>
                    <p>{player.name}</p>
                    <CloseButton
                      className="absolute -top-2 -right-2 rounded-full"
                      onPress={() => handleRemove(player)}
                    />
                  </Surface>
                ))}
              </div>
            </div>
          )}
          <SearchField
            variant="secondary"
            className="mb-1"
            onChange={handleSearch}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="ユーザーIDもしくは名前で検索" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ScrollShadow className="min-h-0">
            {searchedProfiles === null && (
              <ListBox
                aria-label="ユーザー選択"
                onAction={handleSelect}
                className="px-0"
              >
                <ListBox.Section>
                  <Header>新規ユーザー</Header>
                  <ListBox.Item id="new" textValue="新規ユーザー">
                    <User name="プレイヤー名を入力" />
                  </ListBox.Item>
                </ListBox.Section>
                <ListBox.Section>
                  <Header>フレンド</Header>
                  {friends.map((friend) => (
                    <ListBox.Item
                      key={friend.id}
                      id={friend.id}
                      textValue={friend.name ?? ""}
                      className="flex w-full items-center justify-between"
                    >
                      <User name={friend.name} displayId={friend.displayId} />
                      {selectedPlayers.some((p) => p.id === friend.id) && (
                        <Check />
                      )}
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
              </ListBox>
            )}
            {searchedProfiles !== null && (
              <>
                {searchedProfiles.length === 0 && (
                  <p className="mt-10 text-center text-sm text-muted">
                    見つかりませんでした
                  </p>
                )}
                {searchedProfiles.length > 0 && (
                  <ListBox
                    aria-label="検索結果"
                    onAction={handleSelect}
                    className="px-0"
                  >
                    {searchedProfiles.map((item) => (
                      <ListBox.Item
                        key={item.id}
                        id={item.id}
                        textValue={item.name ?? ""}
                        className="flex w-full items-center justify-between"
                      >
                        <User name={item.name} displayId={item.displayId} />
                        {selectedPlayers.some((p) => p.id === item.id) && (
                          <Check />
                        )}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                )}
              </>
            )}
          </ScrollShadow>
          <ProfileCreateModal
            isOpen={profileCreateModal.isOpen}
            onClose={profileCreateModal.close}
            onProfileCreate={(profile: Profile) => {
              setSelectedPlayers([...selectedPlayers, profile]);
            }}
          />
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button variant="ghost" onPress={onBack}>
          戻る
        </Button>
        <Button variant="primary" type="submit" isPending={isPending}>
          ゲーム開始
        </Button>
      </Drawer.Footer>
    </Form>
  );
}
