import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTodos, ITEMS_PER_PAGE, setPage } from "../redux/todoSlice";
import Pagination from "./Pagination";

export default function TodoList() {
  const dispatch = useAppDispatch();
  const { todos, total, page, loading, error } = useAppSelector((state) => state.todos);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchTodos(page));
  }, [dispatch, page]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold">Todos</h1>

        {loading && <p className="py-10 text-center text-gray-500">Loading...</p>}
        {error && <p className="py-10 text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm"
              >
                <span>{todo.title}</span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    todo.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {todo.completed ? "Done" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(newPage) => dispatch(setPage(newPage))}
        />
      </div>
    </main>
  );
}
