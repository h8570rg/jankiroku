"use client";

import dynamic from "next/dynamic";

const ReleaseNotesModal = dynamic(() => import("./ReleaseNotesModal"), {
	ssr: false,
});

export function ReleaseNotes() {
	return <ReleaseNotesModal />;
}
