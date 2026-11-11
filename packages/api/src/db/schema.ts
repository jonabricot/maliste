import { boolean, integer, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import {user} from './auth-schema.ts'

export * from './auth-schema.ts'

export const list = pgTable("list", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  authorId: text().references(() => user.id).notNull(),
  allowIdeaProposal: boolean().default(false),
  createdAt: timestamp().defaultNow(),
});

export const idea = pgTable("idea", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  link: text(),
  listId: uuid().references(() => list.id),
  color: varchar({ length: 255 }),
  authorId: integer().references(() => participant.id),
  createdAt: timestamp().defaultNow(),
});

export const participant = pgTable("participant", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  listId: uuid().references(() => list.id),
  createdAt: timestamp().defaultNow(),
});

export const sharedList = pgTable(
  'shared_list',
  {
    listId: uuid()
      .notNull()
      .references(() => list.id),
    userId: text()
      .notNull()
      .references(() => user.id),
  },
  (t) => [primaryKey({ columns: [t.listId, t.userId] })],
);

export const userToParticipant = pgTable(
  'user_to_participant',
  {
    userId: text()
      .notNull()
      .references(() => user.id),
    participantId: integer()
      .notNull()
      .references(() => participant.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.participantId] })],
);

export const participantToIdea = pgTable(
  'participant_to_idea',
  {
    ideaId: integer()
      .notNull()
      .references(() => idea.id),
    participantId: integer()
      .notNull()
      .references(() => participant.id),
  },
  (t) => [primaryKey({ columns: [t.ideaId, t.participantId] })],
);