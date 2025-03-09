import React from 'react'
import {NativeSelect, Button, Input, HStack, Box, Flex, } from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useEventStore } from '../../store/event'


const Navbar = () => {
  const { 
    searchText, 
    setSearchText, 
    fetchEvents, 
    fetchEventsByAll, 
    setIsCombinedSearching 
  } = useEventStore();

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
    <Flex align="center" justify="center" alignItems="center">
      <HStack w="80%" align="center" justify="center">

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
    </Flex>
  )
}

export default Navbar
