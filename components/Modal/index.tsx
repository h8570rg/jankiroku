"use client";

import { useDisclosure } from "@heroui/react";

export type { ModalProps } from "@heroui/react";
export {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";

export type UseModalReturn = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	bind: {
		isOpen: boolean;
		onOpenChange: (isOpen: boolean) => void;
	};
};

export const useModal = (): UseModalReturn => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	return {
		isOpen,
		onOpen,
		onClose,
		bind: {
			isOpen,
			onOpenChange,
		},
	};
};
