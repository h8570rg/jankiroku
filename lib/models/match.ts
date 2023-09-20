import { services } from "../services";

export type Matches = Awaited<ReturnType<typeof services.matches.get>>;
export type Match = Awaited<ReturnType<typeof services.matches.create>>; // TODO: change to get
