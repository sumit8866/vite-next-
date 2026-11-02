import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { addTodo, deleteTodo, fetchTodos, ITEMS_PER_PAGE, updateTodo } from "../redux/todoSlice";

const pageButton = "rounded-md px-3 py-2 text-sm shadow-sm transition-all hover:bg-black hover:text-white";

export default function TodoList() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, total, loading, error } = useSelector((state: RootState) => state.todos);

  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchTodos(page));
  }, [dispatch, page]);

  // setPage fetches through the useEffect above, but the same page needs its own fetch.
  const goToPage = (newPage: number) => {
    if (newPage === page) dispatch(fetchTodos(page));
    else setPage(newPage);
  };

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const result = await dispatch(addTodo(title.trim()));
    if (addTodo.fulfilled.match(result)) {
      setTitle("");
      goToPage(1); // the newest todo is first
    }
  };

  const handleSave = async (event: FormEvent, id: number) => {
    event.preventDefault();
    if (!editTitle.trim()) return;
    const result = await dispatch(updateTodo({ id, title: editTitle.trim() }));
    if (updateTodo.fulfilled.match(result)) setEditId(null);
  };

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteTodo(id));
    if (deleteTodo.fulfilled.match(result)) {
      // If that was the last todo on this page, go back one page.
      goToPage(list.length === 1 && page > 1 ? page - 1 : page);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Todos</h1>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2"
          placeholder="Add a todo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-white" disabled={loading}>
          Add
        </button>
      </form>

      {error && <p className="mb-4 text-center text-red-600">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-gray-500">Loading...</p>
      ) : list.length === 0 ? (
        !error && <p className="py-10 text-center text-gray-500">No todos</p>
      ) : (
        <>
          <ul className="space-y-2">
            {list.map((todo) => (
              <li key={todo.id} className="rounded-lg bg-white p-3 shadow-md">
                {editId === todo.id ? (
                  <form onSubmit={(event) => handleSave(event, todo.id)} className="flex items-center gap-2">
                    <input
                      className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                    <button type="submit" className="px-2 text-sm">
                      Save
                    </button>
                    <button type="button" className="px-2 text-sm" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 break-words">{todo.title}</span>
                    <button
                      className="px-2 text-sm"
                      onClick={() => {
                        setEditId(todo.id);
                        setEditTitle(todo.title);
                      }}
                    >
                      Edit
                    </button>
                    <button className="px-2 text-sm text-red-600" onClick={() => handleDelete(todo.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 py-6">
              <button className={pageButton} onClick={() => setPage(page > 1 ? page - 1 : 1)}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`${pageButton} ${page === index + 1 ? "bg-black text-white" : "bg-white text-black"}`}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button className={pageButton} onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
