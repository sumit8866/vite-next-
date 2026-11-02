# Vite template

React + TypeScript + Redux Toolkit + Tailwind CSS v4, with a todo list: add, edit, delete and pagination.

Run `npm install`, then `npm run dev`. This starts the app and a small local API together.

- `db.json` - where your todos are saved. It starts empty.
- `src/redux/store.ts` - the store.
- `src/redux/todoSlice.ts` - fetch, add, edit and delete. Change `API_URL` here to use a real API.
- `src/components/TodoList.tsx` - the todo page.
