import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { type List } from '../data/schema'
import { client } from '@/api/client'
import { useQuery } from '@tanstack/react-query'
import { getUsersQueryOption } from '@/features/users/data/query'
import { getRouteApi, useRouter } from '@tanstack/react-router'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: List
}

const formSchema = z.object({
  name: z.string().min(1, 'Title is required.'),
  authorId: z.string().min(1, 'Auteur requis'),
})
type TaskForm = z.infer<typeof formSchema>

const route = getRouteApi('/_authenticated/lists/')

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow
  const router = useRouter()

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
    },
  })

  const users = useQuery(getUsersQueryOption())

  const onSubmit = async (data: TaskForm) => {
    if (isUpdate) {
      await client.admin.list[':id'].$post({ param: {id: currentRow.id}, json: data })
      router.invalidate()
    }
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='authorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur</FormLabel>
                  <FormControl>
                    <SelectDropdown 
                      defaultValue={field.value} 
                      onValueChange={field.onChange} 
                      isPending={users.isFetching} 
                      items={users.data?.map(u => ({ value: u.id, label: u.email }))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
