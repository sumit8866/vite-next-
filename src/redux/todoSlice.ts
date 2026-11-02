import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: number;
  title: string;
}

interface TodoState {
  list: Todo[];
}

const initialState: TodoState = {
  list: [],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.list = action.payload;
    },
    addTodo: (state, action: PayloadAction<string>) => {
      state.list.unshift({ id: Date.now(), title: action.payload });
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      state.list = state.list.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo,
      );
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { setTodos, addTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
