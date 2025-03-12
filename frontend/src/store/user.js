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
      if (user_id) {
        const respond = await fetch(`/api/users/${user_id}`, { cache: "no-store" });
        const data = await respond.json();
        set({ user: data.data });
        if(data.success){
          return data.data;
        } else {
          return null;
        }
      }
    },
 

    updateUserProfile: async(user_id, newUser, newProfile) => {

      const updateData = {};
      if (newUser !== undefined) updateData.username = newUser;
      if (newProfile !== undefined) updateData.profileImage = newProfile;

      const res = await fetch(`/api/users/${user_id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUser, profileImage: newProfile }),
      });

      const data = await res.json();

      if(data.success){
        set((state) => ({
          curr_user: state.curr_user._id === user_id ? data.data : state.curr_user,
        }));
        return data.data;   // Return the updated user
      }
      return null;
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

    // Following and Followers Function
    updateFollow: async (curr_userid, targetUserId, isFollowing) => {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: curr_userid,
          action: isFollowing ? "follow" : "unfollow"
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Update the current user's following array
        set((state) => {
          const currentFollowing = state.curr_user.following || [];
          
          if(isFollowing){
            // If the target user ID is not in following, add it, otherwise leave it unchanged
            if(!currentFollowing.includes(targetUserId)){
              // Remove target ID when unfollowing
              return {
                curr_user:{
                  ...state.curr_user,
                  following: [...currentFollowing, targetUserId],
                }
              };
            }else{
              return state;
            }
          }else{
            return {
              curr_user: {
                ...state.curr_user,
                following: currentFollowing.filter(id => id !== targetUserId),
              }
            };
          }
        });
      }
      return data;
    },
  }))
);
