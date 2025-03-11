import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@chakra-ui/react";
import { IoMdNotificationsOutline } from "react-icons/io";

const NotificationBell = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef();

  // Get Notification Data
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/notifications/${userId}`);
      const result = await response.json();
      console.log("Fetched notifications:", result);
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // Toggles the drop-down menu and marks it as read, but doesn't clear the notification content directly
  const toggleDropdown = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      try {
        const response = await fetch(`http://localhost:4000/api/notifications/${userId}/read`, {
          method: "PUT",
        });
        if (response.ok) {
          // Update the local status after marking it as read and set isRead to true for all notifications.
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  // Auto-close drop-down menu: closes when clicking outside the component's area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Only the number of unread notifications is counted
  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <Box position="relative" ref={bellRef}>
      <Button
        aria-label="Notifications"
        onClick={toggleDropdown}
        bg="white"
        color="black"
        borderRadius="md"
        _hover={{ bg: "gray.100" }}
        w="50px"
        h="50px"
        p={0}
        position="relative"
      >
        <IoMdNotificationsOutline size={24} />
        {unreadNotifications.length > 0 && (
          <Box
            position="absolute"
            top="0"
            right="0"
            transform="translate(50%, -50%)"
            bg="red"
            color="white"
            borderRadius="full"
            width="20px"
            height="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
          >
            {unreadNotifications.length}
          </Box>
        )}
      </Button>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={2}
          w="300px"
          bg="white"
          color="black"
          boxShadow="md"
          borderRadius="md"
          p={2}
          maxH="300px"
          overflowY="auto"
        >
          {notifications.length === 0 ? (
            <Box p={2}>No notification</Box>
          ) : (
            notifications.map((notification) => (
              <Box key={notification._id} borderBottom="1px solid #eee" p={2}>
                <Box fontSize="sm">{notification.message}</Box>
                <Box fontSize="xs" color="gray.500">
                  {new Date(notification.createdAt).toLocaleString()}
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationBell;
