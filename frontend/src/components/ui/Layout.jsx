import { useState } from "react";
import { Box, Container, Flex, useMediaQuery} from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import LoginPage from "../../pages/LoginPage"
import {Toaster, toaster} from "./toaster"

// Layout Component
const Layout = () => {  // Arrow function that returns a React JSX structure

  return (
    <>
      <Toaster />
      <Flex direction="column" height="100vh" p={3} overflow="hidden">
        <Container maxW="100%" height="8%" color="white" bg="green.100">
          <Navbar />
        </Container>

        <Container height="4%" >

        </Container>
        
        <Flex flex="1" overflow="auto">  
          <Container 
            css={{
              "@media (min-width: 820px)": {
                display: "block",
              },
              "@media (max-width: 819px)": {
                display: "none",
              },
            }}
            w="280px"
            maxW="280px"  // Minimum width the sidebar can shrink to
            minW="250px"  // Maximum width remains fixed at 250px
            mt={2} mr={2} p={0}
          >
            <Sidebar />
          </Container>

          <Container 
            maxW="100%" 
            sx={{ "@media (min-width: 1000px)": { maxW: "83%" } }}
            overflow="auto"
          >  
            <Outlet />  
          </Container>
        </Flex>
        
        <LoginPage />
      </Flex> 
    </>
  )};

export default Layout;