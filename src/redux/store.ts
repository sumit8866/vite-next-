import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Save the todos to localStorage after every change.
store.subscribe(() => {
  localStorage.setItem("todos", JSON.stringify(store.getState().todos.list));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
