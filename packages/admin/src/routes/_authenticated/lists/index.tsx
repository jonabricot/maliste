import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Tasks } from '@/features/lists'
import { priorities, statuses } from '@/features/lists/data/data'
import { getListsQueryOptions } from '@/features/lists/data/query'

const taskSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(statuses.map((status) => status.value)))
    .optional()
    .catch([]),
  priority: z
    .array(z.enum(priorities.map((priority) => priority.value)))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/lists/')({
  validateSearch: taskSearchSchema,
  component: Tasks,
  loader: ({context}) => context.queryClient.query(getListsQueryOptions())
})
