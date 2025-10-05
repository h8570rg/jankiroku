"use client";

import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/Button";
import { useMatchContext } from "../../../context";

export const GameModalTrigger = forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		isPlayersShort: boolean;
	}
>(function GameModalTrigger({ isPlayersShort, onPress, ...props }, ref) {
	const { onOpen } = useMatchContext().gameModal;

	// buttonにして親でasにするとpropsが渡せない
	return (
		<Button
			ref={ref}
			onPress={(e) => {
				if (isPlayersShort) {
					alert("プレイヤーが足りません");
					return;
				}
				onOpen();
				onPress?.(e);
			}}
			{...props}
		/>
	);
});
