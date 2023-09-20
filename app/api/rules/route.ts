import { NextResponse } from "next/server";

import { services } from "~/lib/services";
import { RuleCreatePayload } from "~/lib/services/rules";

export async function POST(request: Request) {
  const body = (await request.json()) as RuleCreatePayload;
  const data = await services.rules.create(body);
  return NextResponse.json(data);
}
