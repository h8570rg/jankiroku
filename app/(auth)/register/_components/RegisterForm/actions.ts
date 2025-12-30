"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import { createClient } from "@/lib/supabase/server";
import { schema } from "@/lib/utils/schema";

type State = {
	errors?: {
		base?: string[];
		name?: string[];
		displayId?: string[];
	};
};

const updateProfileSchema = z.object({
	name: schema.name,
	displayId: schema.displayId,
});

export async function updateProfile(
	_userId: string,
	_prevState: State,
	formData: FormData,
): Promise<State> {
	const validatedFields = updateProfileSchema.safeParse({
		name: formData.get("name"),
		displayId: formData.get("displayId"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, displayId } = validatedFields.data;

	const { updateUserProfile } = await serverServices();

	const result = await updateUserProfile({
		name,
		displayId,
	});

	if (!result.success) {
		if (result.error.code === "23505") {
			return {
				errors: {
					displayId: ["このIDは既に使用されています。"],
				},
			};
		} else {
			throw result.error;
		}
	}

	revalidatePath("/", "layout");
	redirect("/matches");
}

export async function signOut() {
	const supabase = await createClient();

	await supabase.auth.signOut();

	/**
	 * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
	 */
	revalidatePath("/", "layout");
	redirect("/login");
}
