import { Box, Button } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'

import Layout from './components/ui/Layout'


function App() {
  return (
    <Box minH={"100vh"}>
      <Routes>
        {/* Parent Route with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* Nested correctly */}
          <Route path="create" element={<CreatePage />} />
          <Route path="post" element={<PostPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Box>
  )
}

export default App
