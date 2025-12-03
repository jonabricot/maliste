import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { route } from "./index.ts";
import type { ideas, lists, users } from "./db/schema.ts";

type WithCreatedAtProperty<T> = Omit<T, "createdAt"> & { createdAt: string | null }

export type ApiType = typeof route
export type ListSelectType = WithCreatedAtProperty<InferSelectModel<typeof lists>>
export type ListInsertType = Omit<InferInsertModel<typeof lists>, 'createdAt'>
export type IdeaSelectType = WithCreatedAtProperty<InferSelectModel<typeof ideas>>
export type IdeaInsertType = Omit<InferInsertModel<typeof ideas>, 'createdAt'>
export type UserSelectType = WithCreatedAtProperty<InferSelectModel<typeof users>>
export type UserInsertType = Omit<InferInsertModel<typeof users>, 'createdAt'>

export type ListType = ListSelectType & { ideas: IdeaSelectType[], author: UserSelectType }