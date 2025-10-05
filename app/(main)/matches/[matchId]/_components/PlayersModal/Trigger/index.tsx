"use client";

import { forwardRef } from "react";
import { useMatchContext } from "../../../context";

export const PlayersModalTrigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button">
>(function PlayersModalTrigger({ onClick, ...props }, ref) {
	const { onOpen } = useMatchContext().playersModal;

	return (
		<button
			ref={ref}
			onClick={(e) => {
				onOpen();
				onClick?.(e);
			}}
			{...props}
		/>
	);
});
