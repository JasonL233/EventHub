import {create} from "zustand"

export const useEventStore = create((set) => ({
    events:[],

    fetchEvent: async (id) => {
        const respond = await fetch("/api/events/{id}");
        const data = await respond.json();
        set({events: data});
    },
}));