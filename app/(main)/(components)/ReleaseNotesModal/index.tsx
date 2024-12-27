"use client";

import { Suspense } from "react";
import { Button } from "@/components/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Modal";
import packageJson from "@/package.json";
import { versionComponents } from "./versions";

// バージョンをパースして数値に変換するヘルパー関数
function parseVersion(version: string) {
  return version.split(".").map(Number);
}

// バージョンの大小を比較する関数
function isVersionGreater(v1: string, v2: string) {
  const parsedV1 = parseVersion(v1);
  const parsedV2 = parseVersion(v2);

  for (let i = 0; i < 3; i++) {
    if (parsedV1[i] > parsedV2[i]) return true;
    if (parsedV1[i] < parsedV2[i]) return false;
  }

  return false;
}

function setLastVersion() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("lastVersion", packageJson.version);
  }
}

function ReleaseNotesModal() {
  const lastVersion =
    typeof window !== "undefined"
      ? window.localStorage.getItem("lastVersion")
      : undefined;

  const newVersions = Object.entries(versionComponents).filter(([v]) =>
    lastVersion ? isVersionGreater(v, lastVersion) : v === "0.1.0",
  );

  if (lastVersion && newVersions.length === 0) {
    return null;
  }

  const onClose = () => {
    setLastVersion();
  };

  return (
    <Suspense>
      <Modal defaultOpen={true} size="xs" placement="center" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                リリース情報
              </ModalHeader>
              <ModalBody>
                {newVersions.reverse().map(([v, Component]) => (
                  <Component key={v} />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  閉じる
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Suspense>
  );
}

export default ReleaseNotesModal;
