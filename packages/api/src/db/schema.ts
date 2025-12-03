import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
  token: uuid().defaultRandom(),
  createdAt: timestamp().defaultNow(),
});

export const lists = pgTable("lists", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  participants: varchar({ length: 255 }).array(),
  authorId: uuid().references(() => users.id).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const ideas = pgTable("ideas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  link: text(),
  participants: varchar({ length: 255 }).array(),
  listId: uuid().references(() => lists.id),
  color: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
});

export const usersRelation = relations(users, ({ many }) => ({
    lists: many(lists),
}));

export const listsRelation = relations(lists, ({ many, one }) => ({
    ideas: many(ideas),
    author: one(users, {
        fields: [lists.authorId],
        references: [users.id]
    })
}));

export const ideasRelation = relations(ideas, ({ many, one }) => ({
    list: one(lists, {
      fields: [ideas.listId],
      references: [lists.id]
    }),
}));