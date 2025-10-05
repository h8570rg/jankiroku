"use client";

import { useModal } from "@/components/Modal";
import { MatchContext } from "../../context";

export function MatchContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const playersModal = useModal();
	const gameModal = useModal();
	const chipModal = useModal();
	const ruleModal = useModal();
	const dataModal = useModal();

	return (
		<MatchContext.Provider
			value={{
				playersModal,
				gameModal,
				chipModal,
				ruleModal,
				dataModal,
			}}
		>
			{children}
		</MatchContext.Provider>
	);
}
