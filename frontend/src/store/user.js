import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEventStore } from "./event";

export const useUserStore = create(
  persist((set) => ({
    
    users: [],
    curr_user: null,
    isLoggedIn: false,

    setUsers: (users) => set({ users }),
    setCurrentUser: (user) => set({ curr_user: user, isLoggedIn: !!user }),

    createUser: async (newUser) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }); // send information to server

      const data = await res.json(); // get respond from server

      if (data.success) {
        set((state) => ({ users: [...state.users, data.data] })); // store new user information in users
        return { success: data.success, message: data.message };
      }

      return { success: data.success, message: data.message };
    },

    userLogin: async (user) => {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();

      if (data.success) {
        set((state) => {
          const updatedState = {
            curr_user: data.user,
            isLoggedIn: true,
          };
          console.log("Updated curr_user inside set:", data.user);
          return updatedState;})

          useEventStore.getState().fetchEvents();
      }
      return { success: data.success, message: data.message };
    },

    userLogOut: () => {
      set({curr_user: null, isLoggedIn: false});
    },

    updateLikedPost: async (user_id, event_id, isLiked) => {
      const res = await fetch(`/api/users/${user_id}/likedPosts`, {
        method: "PATCH",
        headers:  {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isLiked ? "liked" : "unliked",
          event_id,
        }),
      });

      const data = await res.json();

      if (data.success)
      {

      }
    },

    fetchUsersByUsername: async(username) => {
      const respond = await fetch(`/api/search/users/${username}`);
      const data = await respond.json();
      const searchUsers = data.data
      if (searchUsers.length === 0){
        console.log("NO USER")
      }
      else {
        console.log(data.data);
      }
      set({ users: data.data });
    }

  }))

);
