import { create } from "zustand";
import { replyComment } from "../../../backend/controllers/event.controller";

export const useEventStore = create((set) => ({
  event: [],
  events: [],
  comments: [],
  searchType: "Combined",
  searchText: "",
  isCombineSearching: false,

  // GET single event data
  fetchEvent: async (_id) => {
    const respond = await fetch(`/api/events/${_id}`);
    const data = await respond.json();
    set({ event: data.data });
  },

  // GET all events data
  fetchEvents: async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    set({ events: data.data });
    set({searchType: "Combined"});
    set({serachText: ""});
  },

  // GET all comments
  fetchComments: async (event_id) => {
    const res = await fetch(`/api/events/${event_id}/comments`);
    const data = await res.json();
    set({ comments: data.data });
  },

  // Get events that match title
  fetchEventsByTitle: async (title) => {
    const respond = await fetch(`/api/search/events/${title}`);
    const data = await respond.json();
    const searchedEvents = data.data
    if (searchedEvents.length === 0){
      console.log("NO EVENTS")
    }
    set({ events: data.data });
    set({ searchText: title});
    set({ searchType: "Event Title"});
  },

  fetchEventsByUsername: async (username) => {
    console.log("NAME: ", username);
    const respond = await fetch(`/api/search/users/${username}`);
    const data = await respond.json();
    set({ events: data.data });
    set({ searchText: username});
    set({ searchType: "Username"});
  },

  fetchEventsByTag: async (tag) => {
    const respond = await fetch(`/api/search/tag/${tag}`);
    const data = await respond.json();
    set({ events: data.data});
    set({ searchText: tag});
    set({ searchType: "Event Tag"});
  },

  fetchEventsByAll: async (query) => {
    const respond = await fetch(`/api/search/all/${query}`);
    const data = await respond.json();
    set({events: data.data});
    set({searchText: query});
    set({searchType: "Combined"});
    set({isCombineSearching: true});
  },

  createEvent: async (newEvent) => {
    if (
      !newEvent.title?.trim() ||
      !newEvent.mediaUrl?.trim() ||
      !newEvent.description?.trim() ||
      !newEvent.publisherId
    ) {
      return {
        success: false,
        message: "Please provide title, description, mediaUrl, and publisherId",
      };
    }
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, message: data.message };
    }

    // If success, push new event to store
    set((state) => ({ events: [...state.events, data.data] }));
    return { success: true, message: "Event created successfully" };
  },

  updateLikes: async (event_id, user_id, isLiked, newLikes) => {
    const res = await fetch(`/api/events/${event_id}/like`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        action: isLiked ? "like" : "unlike",
        likes: newLikes,
      }),
    });

    if (!res.ok) {
      console.error("Failed to update like status");
      return;
    }

    const data = await res.json();

    set((state) => ({
      events: state.events.map((evn) =>
        evn._id === event_id
          ? { ...evn, likes: newLikes, likedBy: data.data.likedBy }
          : evn
      ),
    }));
  },

  addComment: async (event_id, user_id, newComment) => {
    const res = await fetch(`/api/events/${event_id}/comment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        comment: newComment,
      }),
    });

    if (!res.ok) {
      console.error("Failed to add comment");
      return;
    }

    const data = await res.json();
    set((state) => ({
      events: state.events.map((evn) =>
        evn._id === event_id
          ? { ...evn, comments:data.data.comments }
          : evn
      ),
    }));
    return { success: true, message: "Adding new comment successfully" };
  },

  // Reply a comment
  replyComment: async (event_id, user_id, newComment, target) => {
    const res = await fetch(`/api/events/${event_id}/reply`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        comment: newComment,
        reply_to: target
      }),
    });

    const data = await res.json();
    set((state) => ({
      events: state.events.map((evn) =>
        evn._id === event_id
          ? { ...evn, comments:data.data.comments }
          : evn
      ),
    }));
    return { success: true, message: "Adding new reply successfully" };
  },


  setIsCombinedSearching: async (isCombined) => {
    set({isCombineSearching: isCombined});
  },

  setSearchText: async (text) => {
    set({searchText: text});
  },

    // Delete Post
    deletePost: async(id) => {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if(!data.success){
        console.error("Faild to delete post: ", data.message);
        return { success: false, meaasge: data.message };
      }
  
      // Update events list, filiter deleted events
      set((state) => ({
        events: state.events.filter((event) => event._id !== id),
      }));
      return { success: true, message: data.message };
    },
}));
