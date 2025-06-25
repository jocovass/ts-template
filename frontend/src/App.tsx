import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  description: HTMLInputElement;
}
interface TodoFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

type Todo = {
  description?: string;
  id: string;
  name: string;
  status: "done" | "active" | "deleted";
  created_at: string;
  updated_at: string;
};

type ApiMeta = {
  current_page: number;
  next_page: null | number;
  per_page: number;
  prev_page: null | number;
  total_count: number;
  total_pages: number;
};

type ApiSuccessResponse<T> = {
  status: "success";
  data: T;
  meta: ApiMeta;
};

type ApiErrorResponse = {
  error: {
    fields?: { error: string[]; field: string }[];
    message?: string;
  };
  status: "error";
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/todos`, {
          credentials: "include",
        });
        const result: ApiResponse<Todo[]> = await response.json();
        if (result.status === "success") {
          setTodos(result.data);
        } else {
          console.log(result.error.message);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    fetchTodos();
  }, []);

  return (
    <div
      style={{
        width: "95%",
        maxWidth: "550px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <h1>Plan Your Day</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <form
          onSubmit={async (event: React.FormEvent<TodoFormElement>) => {
            event.preventDefault();
            const targetObj = event.currentTarget;
            const { name, description } = event.currentTarget.elements;
            setLoading(true);
            try {
              const response = await fetch(`${API_URL}/todos`, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: name.value,
                  description: description.value,
                }),
              });
              const result: ApiResponse<Todo> = await response.json();
              if (result.status === "success") {
                setTodos([result.data, ...todos]);
              } else {
                console.log(result.error.message);
              }
              targetObj.reset();
            } catch (err) {
              console.log(err);
            }
            setLoading(false);
          }}
        >
          <div className="form-field">
            <label htmlFor="name">
              Name <sup>*</sup>
            </label>
            <input
              required
              id="name"
              name="name"
              type="text"
              className="form-field__input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              className="form-field__input"
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: "1rem",
            }}
          >
            Add todo
          </button>
        </form>
      </div>
      <div className="card">
        {todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1em",
              cursor: "pointer",
              opacity: todo.status === "active" ? 1 : 0.5,
            }}
            onClick={async () => {
              const response = await fetch(`${API_URL}/todos/${todo.id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: todo.status === "active" ? "done" : "active",
                }),
              });
              const result: ApiResponse<Todo> = await response.json();
              if (result.status === "success") {
                const newTodods = todos.map((t) => {
                  if (t.id === result.data.id) {
                    return {
                      ...t,
                      status: result.data.status,
                    };
                  }
                  return t;
                });
                setTodos(newTodods);
              } else {
                console.log(result.error.message);
              }
            }}
          >
            <div style={{ textAlign: "left" }}>
              <h3
                style={{
                  margin: 0,
                  textDecorationColor: "green",
                  textDecoration:
                    todo.status === "done" ? "line-through" : "none",
                }}
              >
                {todo.name}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  opacity: 0.8,
                  textDecorationColor: "green",
                  textDecoration:
                    todo.status === "done" ? "line-through" : "none",
                }}
              >
                {todo.description}
              </p>
            </div>
            <button
              onClick={async (event) => {
                event.stopPropagation();
                const response = await fetch(`${API_URL}/todos/${todo.id}`, {
                  credentials: "include",
                  method: "DELETE",
                });
                if (response.ok) {
                  setTodos((prev) =>
                    prev.filter((prevTodo) => prevTodo.id !== todo.id)
                  );
                } else {
                  const result = await response.json();
                  console.log(result);
                }
              }}
              type="button"
            >
              🗑
            </button>
          </div>
        ))}
        {loading && <div className="spinner">🌀</div>}
      </div>
    </div>
  );
}

export default App;
