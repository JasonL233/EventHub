import { Box, Container, Flex, Input, Button, VStack } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import LoginPage from "../../pages/LoginPage"

// Layout Component
const Layout = () => {  // Arrow function that returns a React JSX structure
  return (
   <Flex direction="column" height="100vh" p={3}>
    <Container maxW="100%" height="18%" bg="green.800" color="white">
      <Navbar />
    </Container>
    
    <Flex flex="1" overflowY="hideen">  
      <Container maxW="17%" mt={2} mr={2} p={0}>
        <Sidebar />
      </Container>

      <Container maxW="83%" bg="blue.800" mt={2} overflowY="auto" color="white">  
        <Outlet />  
      </Container>
    </Flex>
    <LoginPage />
   </Flex> 
  )
};

export default Layout;