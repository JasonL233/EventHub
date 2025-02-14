import {Box, Button, useColorModeValue} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";


function App() {
  return (
    <Box minH={"100vh"} bg = {useColorModeValue("red.500", "gray.900")}>
      <Navbar />
      <Routes>
        <Route path="/" element = {<HomePage />} />
        <Route path="/create" element = {<CreatePage />} />
        <Route path="/post" element = {<PostPage />} />
      </Routes>
    </Box>
  );
}

export default App
