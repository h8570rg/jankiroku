import { services } from "../services";

export type Matches = Awaited<ReturnType<typeof services.matches.get>>;
