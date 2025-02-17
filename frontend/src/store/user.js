import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
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
    return { success: data.success, message: data.message };
  },
}));
