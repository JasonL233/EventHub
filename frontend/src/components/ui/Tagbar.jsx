import { HStack, Button } from "@chakra-ui/react"
import React, { useState } from 'react'
import { useEventStore } from '../../store/event';

const Tagbar = () => {
    const {
        searchText,
        isCombineSearching,
        fetchEventsByAll, 
        fetchEventsByTitle,
        fetchEventsByUsername, 
        fetchEventsByTag, 
    } = useEventStore();

    const [filter, setFilter] = useState("All");

    const handleFilterClick = (filterType, fetchFunction) => {
        setFilter(filterType);
        fetchFunction(searchText);
    }
    
    return (
        <div>
            <HStack spacing={6}>

                { isCombineSearching && (
                    <>
                    <Button variant="ghost" borderRadius={"3xl"} bg={filter === "All" ? "gray.100" : ""} onClick={() => handleFilterClick("All", fetchEventsByAll)}>
                        All
                    </Button>

                    <Button variant="ghost" borderRadius={"3xl"} bg={filter === "Title" ? "gray.100" : ""} onClick={() => handleFilterClick("Title", fetchEventsByTitle)}>
                        Title
                    </Button>

                    <Button variant="ghost" borderRadius={"3xl"} bg={filter === "Username" ? "gray.100" : ""} onClick={() => handleFilterClick("Username", fetchEventsByUsername)}>
                        Username
                    </Button>

                    <Button variant="ghost" borderRadius={"3xl"} bg={filter === "Tag" ? "gray.100" : ""} onClick={() => handleFilterClick("Tag", fetchEventsByTag)}>
                        Tag
                    </Button>
                    </>
                )}
            </HStack>
        </div>
    );
}

export default Tagbar;