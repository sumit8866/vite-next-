import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { addTodo, deleteTodo, setTodos, updateTodo } from "../redux/todoSlice";

const itemsPerPage = 10;
const pageButton = "rounded-md px-3 py-2 text-sm shadow-sm transition-all hover:bg-black hover:text-white";

export default function TodoList() {
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => state.todos.list);

  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const pageList = list.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    dispatch(setTodos(JSON.parse(localStorage.getItem("todos") ?? "[]")));
  }, [dispatch]);

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch(addTodo(title.trim()));
    setTitle("");
    setPage(1); // the newest todo is first
  };

  const handleSave = (event: FormEvent, id: number) => {
    event.preventDefault();
    if (!editTitle.trim()) return;
    dispatch(updateTodo({ id, title: editTitle.trim() }));
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
    // If that was the last todo on this page, go back one page.
    if (pageList.length === 1 && page > 1) setPage(page - 1);
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
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-white">
          Add
        </button>
      </form>

      {list.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No todos</p>
      ) : (
        <>
          <ul className="space-y-2">
            {pageList.map((todo) => (
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
