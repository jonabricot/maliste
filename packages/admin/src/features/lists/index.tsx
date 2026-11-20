import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
import { ListsTable } from './components/lists-table'
import { getRouteApi } from '@tanstack/react-router'
import { List } from './data/schema'

const route = getRouteApi('/_authenticated/lists/')

export function Tasks() {
  const lists = route.useLoaderData()

  return (
    <TasksProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Lists</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of created lists
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <ListsTable data={lists as unknown as List[]} />
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
