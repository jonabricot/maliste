import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { route } from "./server.ts";
import type { idea, list, participant, user } from "./db/schema.ts";

type WithCreatedAtProperty<T> = Omit<T, "createdAt"> & { createdAt: string | null }

export type ApiType = typeof route
export type ListSelectType = WithCreatedAtProperty<InferSelectModel<typeof list>>
export type ListInsertType = Omit<InferInsertModel<typeof list>, 'createdAt'>
export type IdeaSelectType = WithCreatedAtProperty<InferSelectModel<typeof idea>>
export type IdeaInsertType = Omit<InferInsertModel<typeof idea>, 'createdAt'>
export type UserSelectType = WithCreatedAtProperty<InferSelectModel<typeof user>>
export type UserInsertType = Omit<InferInsertModel<typeof user>, 'createdAt'>
export type ParticipantSelectType = WithCreatedAtProperty<InferSelectModel<typeof participant>>
export type ParticipantInsertType = Omit<InferInsertModel<typeof participant>, 'createdAt'>

export type ListType = ListSelectType & { ideas: (IdeaSelectType & { participants: ParticipantSelectType[], author: UserSelectType })[], author: UserSelectType, participants: ParticipantSelectType[] }
export type IdeaType = IdeaSelectType