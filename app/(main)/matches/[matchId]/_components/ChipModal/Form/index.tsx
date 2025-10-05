"use client";

import { useActionState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ModalBody, ModalFooter } from "@/components/Modal";
import type { Match } from "@/lib/type";
import { useMatchContext } from "../../../context";
import { addChip } from "./actions";

type Schema = {
	playerChip: {
		profileId: string;
		chipCount: string;
	}[];
};

export function ChipForm({ match }: { match: Match }) {
	const { chipModal } = useMatchContext();
	const { players, rule } = match;
	const [{ errors, success }, formAction, isPending] = useActionState(
		addChip.bind(null, match.id, players.length),
		{},
	);

	const { control, watch, setValue } = useForm<Schema>({
		defaultValues: {
			playerChip: players.map((player) => ({
				profileId: player.id,
				chipCount: "",
			})),
		},
	});

	const { fields } = useFieldArray<Schema>({
		control,
		name: "playerChip",
	});

	const playerChip = watch("playerChip");

	const isAutoFillAvailable =
		playerChip.filter(({ chipCount }) => chipCount !== "").length ===
		rule.playersCount - 1;

	const totalChipCount = playerChip.reduce(
		(sum, { chipCount }) => sum + Number(chipCount),
		0,
	);

	useEffect(() => {
		if (success) {
			chipModal.onClose();
		}
	}, [chipModal, success]);

	return (
		<form className="contents" action={formAction}>
			<ModalBody>
				<ul className="space-y-1">
					{fields.map((field, index) => (
						<li key={field.id} className="flex items-center gap-1">
							<Controller
								control={control}
								name={`playerChip.${index}.profileId`}
								render={({ field }) => <input type="text" hidden {...field} />}
							/>
							<div className="shrink-0 grow text-small text-foreground">
								{players[index].name}
							</div>
							<Controller
								control={control}
								name={`playerChip.${index}.chipCount`}
								render={({ field }) => (
									<Input
										labelPlacement="outside-left" // 中心ずれを防ぐ
										classNames={{
											base: "basis-[160px] shrink-0",
											input: "text-right placeholder:text-default-400",
										}}
										type="number"
										size="lg"
										startContent={
											isAutoFillAvailable &&
											field.value === "" && (
												<Button
													variant="flat"
													size="sm"
													radius="md"
													color="secondary"
													className="h-6 w-max min-w-0 shrink-0 gap-1 px-2 text-[10px]"
													onPress={() => {
														setValue(field.name, String(-1 * totalChipCount));
													}}
												>
													残り入力
												</Button>
											)
										}
										endContent={
											<div className="pointer-events-none shrink-0">
												<span className="text-small text-default-400">枚</span>
											</div>
										}
										{...field}
									/>
								)}
							/>
						</li>
					))}
				</ul>
				{errors?.playerChip && (
					<p className="whitespace-pre-wrap text-tiny text-danger">
						{errors.playerChip[0]}
					</p>
				)}
			</ModalBody>
			<ModalFooter>
				<Button variant="light" onPress={chipModal.onClose}>
					キャンセル
				</Button>
				<Button type="submit" color="primary" isLoading={isPending}>
					保存
				</Button>
			</ModalFooter>
		</form>
	);
}
