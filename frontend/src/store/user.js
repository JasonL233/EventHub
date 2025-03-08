import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEventStore } from "./event";

export const useUserStore = create(
  persist((set) => ({
    
    user: [],
    users: [],
    curr_user: null,
    isLoggedIn: false,

    setUsers: (users) => set({ users }),
    setCurrentUser: (user) => set({ curr_user: user, isLoggedIn: !!user }),

    fetchUser: async(user_id) => {
      const respond = await fetch(`/api/users/${user_id}`);
      const data = await respond.json();
      set({ user: data.data });
    },

    updateUserProfile: async(user_id, newUser, newProfile) => {
      const res = await fetch(`/api/users/${user_id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUser, profileImage: newProfile }),
      });

      const data = await res.json();

      if(data.success){
        set((state) => ({
          curr_user: {
            ...state.curr_user,
            username: newUser || state.curr_user.username,   // Remain the original username
            profileImage: newProfile || state.curr_user.profileImage,   // Remain the original profile image
          },
        }));
      }
    },

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
        headers:  { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isLiked ? "liked" : "unliked",
          event_id,
        }),
      });

      const data = await res.json();

      if (data.success)
      {
        set((state) => {
          let updatedLikeedPosts;

          if(isLiked){
            // When user likes, add the event_id
            updatedLikeedPosts = [...state.curr_user.likedPosts, event_id];
          }
          else{
            // When user unlikes, delete the event_id
            updatedLikeedPosts = state.curr_user.likedPosts.filter((id) => id !== event_id);
          }

          return {
            curr_user: {
              ...state.curr_user,
              likedPosts: updatedLikeedPosts,
            },
          };
        });
      }
    },

    // User follows/unfollows other organizers
    updateFollowing: async (user_id, organizer_id, isFollowing) => {
      const res = await fetch(`/api/users/${user_id}/following`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFollowing ? "follow" : "unfollow",  // Follow or unfollow
          organizer_id,   // The ID of the target organizer
        }),
      });

      const data = await res.json();

      if(data.success) {
        set((state) => {
          let updatedFollowing;
          if(isFollowing){
            // When a user follows an organizer, add the organizer's ID
            updatedFollowing = [...state.curr_user.following, organizer_id];
          }
          else{
            // When a user unfollows, remove the organizer's ID from the following array
            updatedFollowing = state.curr_user.following.filter((id)=> id !== organizer_id);
          }

          return {
            curr_user: {
              ...state.curr_user,
              following: updatedFollowing,  // Update the following array
            },
          };
        });
      }
    },

    // Update the number of followers of `event organizer`
    updateFollowers: async (organizer_id, user_id, isFollowing) =>{
      const res = await fetch( `/api/users/${organizer_id}/followers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFollowing ? "follow" : "unfollow",   // Follow or unfollow
          user_id,  // Follower's ID
        }),
      });

      const data = await res.json();

      if(data.success){
        set((state) => {
          let updatedFollowers;
          if(isFollowing) {
            // When a user follows the organizer, add user_id to followers
            updatedFollowers = [...state.curr_user.followers, user_id];
          }
          else{
            // When a user unfollows the organizer, remove the user_id from the followers array
            updatedFollowers = state.curr_user.followers.filter((id) => id !== user_id);
          }

          return {
            curr_user: {
              ...state.curr_user,
              followers: updatedFollowers,   // Update the followers array
            },
          };
        });
      }
    },


  }))

);
