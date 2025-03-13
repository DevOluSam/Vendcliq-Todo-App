"use client";
import { RadioGroupDemo } from "@/components/RadioGroup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: number;
}

function DialogDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [addTodoData, setAddTodoData] = useState({
    title: "",
    description: "",
    completed: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await api.get("/todo");
        console.log(res.data);
        setTodos(res.data.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    getTodos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddTodoData({ ...addTodoData, [e.target.id]: e.target.value });
  };

  const addTodo = async () => {
    if (
      !addTodoData.title.trim() ||
      !addTodoData.description.trim() ||
      addTodoData.completed === undefined
    ) {
      toast.error("Please fill in all fields before adding a todo.");
      return;
    }

    try {
      console.log(addTodoData);
      const res = await api.post("/todo", addTodoData);
      setTodos([...todos, res.data.data]); // Update state with new todo
      setAddTodoData({ title: "", description: "", completed: 0 });
      toast.success("Todo has been added");
      setIsDialogOpen(false); // Close modal
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo. Please try again.");
    }
  };

  // Update Todo
  const updateTodo = async (id: number) => {
    try {
      if (!editingTodo) {
        console.error("No todo to update");
        return;
      }

      const updatedTodo = {
        ...editingTodo,
        completed: editingTodo.completed === 1 ? 1 : 0,
      };

      console.log("Updating todo with:", updatedTodo);

      const res = await api.put(`/todo/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo.id === id ? res.data.data : todo)));
      toast.success("Todo has been updated");
      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete Todo
  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todo/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo has been deleted");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <section className="flex flex-col gap-4 h-screen items-center justify-center">
      <div className="text-center w-1/2 ">
        <h1 className="text-3xl font-extrabold text-green-600">Welcome</h1>
        <h1 className="text-xl font-bold mb-4">TODO List</h1>
        {todos.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className=" w-full px-4 p-2 flex justify-between items-center border shadow-lg rounded-md"
              >
                <div className="text-left">
                  <h3 className="font-bold">{todo.title}</h3>
                  <p>{todo.description}</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    onClick={() => setEditingTodo(todo)}
                    className="cursor-pointer"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTodo(todo.id)}
                    className="cursor-pointer"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h5 className="text-xl font-semibold text-gray-500">
            You don't have any todos yet. Create one now.
          </h5>
        )}
      </div>

      {/* Add Todo Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            Add Todo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Todo</DialogTitle>
            <DialogDescription>
              Add a new todo. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="e.g Standup meeting"
                value={addTodoData.title}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="e.g Discuss updates on assigned tasks"
                value={addTodoData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <RadioGroupDemo />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              //   disabled={isAddTodoDisabled}
              className="cursor-pointer"
              onClick={addTodo}
            >
              Add Todo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Todo Dialog */}
      {editingTodo && (
        <Dialog
          open={Boolean(editingTodo)}
          onOpenChange={() => setEditingTodo(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
              <DialogDescription>
                Modify your todo and save changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editingTodo.description}
                  onChange={(e) =>
                    setEditingTodo({
                      ...editingTodo,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="cursor-pointer"
                onClick={() => updateTodo(editingTodo.id)}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

export default DialogDemo;
