import React from 'react'
import { Button, Input, HStack, Box, Flex, Spacer } from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useEventStore } from '../../store/event'
import NotificationBell from './NotificationBell';
import { useUserStore } from '../../store/user';

const Navbar = () => {
  const { 
    searchText, 
    setSearchText, 
    fetchEvents, 
    fetchEventsByAll, 
    setIsCombinedSearching 
  } = useEventStore();

  const currUser = useUserStore((state) => state.curr_user);

  const handleSearch = async (query) => {
    const searchQuery = query || searchText;

    // empty search matches all events
    if (!searchQuery) {
      fetchEvents();
      setIsCombinedSearching(false);
      return;
    }

    fetchEventsByAll(searchQuery);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.target.value);
    }
  }

  return (
    <Flex w="full" align="center" px={4} py={2} bg="white">
      <Box />
      <Spacer />
      <Spacer />
      <HStack spacing={2}>
          <Input 
            w="700px" 
            h="50px" 
            variant="filled" 
            bg="gray.100" 
            borderRadius="full" 
            color="black" 
            placeholder="Search" 
            value={searchText}
            onChange={(e)=> setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Link to="/">
            <Button aria-label="Search database" onClick={() => {handleSearch()}}>
              <CiSearch />
            </Button>
          </Link>
      </HStack>
      <Spacer />
      
      {currUser && (<Box>
        {currUser ? (
          <NotificationBell userId={currUser._id} />
        ) : (
          <NotificationBell userId="" />
        )}
      </Box>)}
    </Flex>
  )
}

export default Navbar
