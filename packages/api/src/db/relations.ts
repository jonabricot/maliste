import { defineRelations } from 'drizzle-orm'
import * as schema from './schema.ts'

export const relations = defineRelations(schema, (r) => ({
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
        lists: r.many.list(),
        participations: r.many.participant({
            from: r.user.id.through(r.userToParticipant.userId),
            to: r.participant.id.through(r.userToParticipant.participantId),
        }),
        sharedLists: r.many.list({
            from: r.user.id.through(r.sharedList.userId),
            to: r.list.id.through(r.sharedList.listId),
        })
    },
    session: {
        user: r.one.user({
            from: r.session.userId,
            to: r.user.id
        })
    },
    account: {
        user: r.one.user({
            from: r.account.userId,
            to: r.user.id
        }),
    },
    list: {
        ideas: r.many.idea(),
        author: r.one.user({
            from: r.list.authorId,
            to: r.user.id
        }),
        participants: r.many.participant({
            from: r.list.id,
            to: r.participant.listId
        }),
    },
    idea: {
        list: r.one.list({
            from: r.idea.listId,
            to: r.list.id
        }),
        author: r.one.participant({
            from: r.idea.authorId,
            to: r.participant.id
        }),
        participants: r.many.participant({
            from: r.idea.id.through(r.participantToIdea.ideaId),
            to: r.participant.id.through(r.participantToIdea.participantId),
        })
    },
    participant: {
        users: r.many.user({
            from: r.participant.id.through(r.userToParticipant.participantId),
            to: r.user.id.through(r.userToParticipant.userId),
        }),
        ideas: r.many.idea({
            from: r.participant.id.through(r.participantToIdea.participantId),
            to: r.idea.id.through(r.participantToIdea.ideaId)
        })
    }
}))