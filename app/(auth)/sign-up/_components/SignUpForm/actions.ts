"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";
import { createClient } from "@/lib/utils/supabase/server";

type State = {
	errors?: {
		base?: string[];
		email?: string[];
		password?: string[];
	};
};

const signUpSchema = z.object({
	email: schema.email,
	password: schema.password,
});

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function signUp(
	_prevState: State,
	formData: FormData,
): Promise<State> {
	const validatedFields = signUpSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email, password } = validatedFields.data;

	const supabase = await createClient();

	const { error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return {
			errors: {
				email: ["このメールアドレスは使用できません。"],
			},
		};
	}

	revalidatePath("/", "layout");
	redirect("/register");
}
