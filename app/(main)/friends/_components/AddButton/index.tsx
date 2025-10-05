"use client";

import { useState } from "react";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useModal,
} from "@/components/Modal";
import { ScrollShadow } from "@/components/ScrollShadow";
import { User } from "@/components/User";
import { browserServices } from "@/lib/services/browser";
import { addFriends } from "./actions";

export function AddButton() {
	const addModal = useModal();
	const [query, setQuery] = useState("");

	const { searchProfiles } = browserServices();

	const { data: profiles, isValidating } = useSWR(
		["searchProfiles", query],
		() =>
			searchProfiles({
				text: query,
			}),
	);

	const handleSearch = useDebouncedCallback((value: string) => {
		setQuery(value);
	}, 300);

	const handleAdd = () => {
		setQuery("");
		addModal.onClose();
	};

	return (
		<>
			<Button variant="light" isIconOnly onPress={addModal.onOpen}>
				<Icon name="personAdd" className="size-5 fill-current" />
			</Button>
			<Modal
				{...addModal.bind}
				hideCloseButton
				onClose={() => {
					setQuery("");
				}}
			>
				<ModalContent>
					<ModalHeader>フレンド追加</ModalHeader>
					<ModalBody>
						<Input
							placeholder="ユーザーIDもしくは名前で検索"
							autoFocus
							startContent={
								<Icon className="size-5 fill-current" name="search" />
							}
							onChange={(e) => {
								handleSearch(e.target.value);
							}}
							defaultValue={query}
						/>
						<ScrollShadow className="h-[280px] py-1">
							{isValidating && (
								<li className="flex items-center justify-between py-2">
									<User skeleton />
								</li>
							)}
							{!isValidating && !!query && profiles?.length === 0 && (
								<p className="mt-10 text-center text-small text-default-500">
									見つかりませんでした
								</p>
							)}
							{!isValidating &&
								profiles &&
								profiles.length > 0 &&
								profiles?.map(({ id, name, displayId, isFriend }) => (
									<li
										key={id}
										className="flex items-center justify-between py-2"
									>
										<User name={name} displayId={displayId} />
										{isFriend ? (
											<div className="w-16 text-center text-tiny text-foreground-500">
												追加済み
											</div>
										) : (
											<form action={addFriends.bind(null, id)}>
												<Button
													color="primary"
													size="sm"
													type="submit"
													onPress={handleAdd}
												>
													追加
												</Button>
											</form>
										)}
									</li>
								))}
						</ScrollShadow>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
