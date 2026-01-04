"use client";

import dynamic from "next/dynamic";

const ReleaseNotesModal = dynamic(() => import("./release-notes-modal"), {
  ssr: false,
});

export function ReleaseNotes() {
  return <ReleaseNotesModal />;
}
