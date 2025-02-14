import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  return (
    <Box minH={"100vh"}>
      {/* <Navbar /> */}
      <Routers>
        <Route path="/" element = {<HomePage />} />
        <Route path="/create" element = {<PostPage />} />
      </Routers>
    </Box>
  );
}

export default App
