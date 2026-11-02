import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/todos";
export const ITEMS_PER_PAGE = 10;

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
};

// Fetches one page. The API sends the total number of todos in a response header.
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (page: number) => {
  const res = await axios.get<Todo[]>(API_URL, {
    params: { _page: page, _limit: ITEMS_PER_PAGE },
  });
  return { todos: res.data, total: Number(res.headers["x-total-count"]) };
});

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        // Ignore a slow response from a page the user has already left.
        if (action.meta.arg !== state.page) return;
        state.loading = false;
        state.todos = action.payload.todos;
        state.total = action.payload.total;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        if (action.meta.arg !== state.page) return;
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const { setPage } = todoSlice.actions;
export default todoSlice.reducer;
