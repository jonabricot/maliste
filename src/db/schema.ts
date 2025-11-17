import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial('id').primaryKey(),
  email: varchar({ length: 255 }),
});

export const providerTable = pgTable("provider", {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }),
  listId: integer("list_id").notNull(),
  userId: integer("user_id")
});

export const listTable = pgTable("list", {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  authorId: integer('author_id').notNull()
});

export const ideaTable = pgTable("idea", {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }),
  listId: integer('list_id').notNull(),
  authorId: integer('author_id').notNull()
});

export const userRelations = relations(userTable, ({ many }) => ({
	lists: many(listTable),
  providers: many(providerTable)
}));

export const listRelations = relations(listTable, ({ many, one }) => ({
	ideas: many(ideaTable),
  author: one(userTable, {
    fields: [listTable.authorId],
    references: [userTable.id]
  })
}));

export const ideaRelations = relations(ideaTable, ({ one }) => ({
	list: one(listTable, {
		fields: [ideaTable.listId],
		references: [listTable.id],
	}),
  author: one(userTable, {
    fields: [ideaTable.authorId],
    references: [userTable.id]
  })
}));