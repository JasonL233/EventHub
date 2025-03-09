import { Container, Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Tagbar from "./Tagbar"
import LoginPage from "../../pages/LoginPage"
import {Toaster} from "./toaster"

// Layout Component
const Layout = () => {  // Arrow function that returns a React JSX structure

  return (
    <>
      <Toaster />
      <Flex direction="column" height="100vh" p={3} overflow="hidden">
        <Container maxW="100%" height="8%" color="white"  display="flex" alignItems="center" justifyContent="center">
          <Navbar />
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

          <Flex direction="column" flex="1" overflow="auto">
            {/* ✅ Tagbar and Outlet wrapped together in a column */}
            <Box w="100%" px={4} py={3} borderBottom="1px solid #ddd">
              <Tagbar />
            </Box>

            <Box flex="1" w="100%" px={4} py={3}>
              <Outlet />
            </Box>
          </Flex>
        </Flex>
        
        <LoginPage />
      </Flex> 
    </>
  )};

export default Layout;