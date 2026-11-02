import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/todos";
export const ITEMS_PER_PAGE = 10;

export interface Todo {
  id: number;
  title: string;
}

interface TodoState {
  list: Todo[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  list: [],
  total: 0,
  loading: true,
  error: null,
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (page: number) => {
  const res = await axios.get<Todo[]>(
    `${API_URL}?_page=${page}&_limit=${ITEMS_PER_PAGE}&_sort=id&_order=desc`,
  );
  return { list: res.data, total: Number(res.headers["x-total-count"]) };
});

export const addTodo = createAsyncThunk("todos/addTodo", async (title: string) => {
  await axios.post(API_URL, { title });
});

export const updateTodo = createAsyncThunk("todos/updateTodo", async (todo: Todo) => {
  await axios.put(`${API_URL}/${todo.id}`, todo);
  return todo;
});

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
});

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.list = state.list.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo,
        );
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default todoSlice.reducer;
