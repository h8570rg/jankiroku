"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

export const useQueryControlledModal = (key: string) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = searchParams.get(key) === "true";

  const onOpen = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set(key, "true");
    router.push(`${pathname}?${params.toString()}`);
  }, [key, pathname, router, searchParams]);

  const onClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }, [key, pathname, router, searchParams]);

  return {
    isOpen,
    onOpen,
    onClose,
  };
};
