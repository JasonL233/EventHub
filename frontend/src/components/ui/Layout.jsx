import { useState } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import LoginPage from "../../pages/LoginPage"
import {Toaster, toaster} from "./toaster"

// Layout Component
const Layout = () => {  // Arrow function that returns a React JSX structure
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
    <Toaster />
   <Flex direction="column" height="100vh" p={3}>
    <Container maxW="100%" height="12%" color="white">
      <Navbar />
    </Container>
    
    <Flex flex="1" overflowY="hideen">  
      <Container 
        display={{ base: "none", md: "block" }} // Hide on base, show on md and above
        maxW={{ base: "0%", md: isSidebarOpen ? "17%" : "0%" }}
        minW={{ base: "0%", md: isSidebarOpen ? "13%" : "0%" }}
        mt={2} mr={2} p={0}>
        <Sidebar />
      </Container>

      <Container 
        maxW={{base: "100%", md: isSidebarOpen ? "83%" : "100%"}}
        mt={2} p={0} overflowY="auto" color="white">  
        <Outlet />  
      </Container>
    </Flex>
    
    <LoginPage />
   </Flex> 
   </>
  )
};

export default Layout;