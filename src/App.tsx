import { Route, Routes } from 'react-router'
import Home from '@/pages/Home'
import EntityPage from '@/pages/EntityPage'
import ListFormDefault from '@/components/Entity/List/Form/ListFormDefault'
import EntityCreatePage from '@/pages/EntityCreatePage'
import EntityEditPage from '@/pages/EntityEditPage'
import SharedListPage from './pages/SharedListPage'


function App() {
  return <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/entity/:type/:id" element={<EntityPage />} />
      <Route path="/entity/:type/:id/edit" element={<EntityEditPage />} />
      <Route path="/entity/:type/create" element={<EntityCreatePage />} />
      <Route path="/list/create" element={<ListFormDefault entity={{ label: '', items: [] }} />} />
      <Route path="/list/:id/update" element={<ListFormDefault entity={{ label: '', items: [] }} />} />
      <Route path="/share/:shareId" element={<SharedListPage />} />
    </Routes>
}

export default App
