import React, { useEffect, useState } from "react";

const BASE_URL = "https://playground.4geeks.com/todo";
const USERNAME = "Cali_ToDo_List";

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const createUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users/${USERNAME}`);

            if (res.status === 404) {
                await fetch(`${BASE_URL}/users/${USERNAME}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
                console.log("User created");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const loadTasks = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users/${USERNAME}`);
            const data = await res.json();

            setTasks(data.todos || []);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const addTask = async () => {
        if (newTask.trim() === "") return;

        const body = {
            label: newTask,
            is_done: false
        };

        try {
            await fetch(`${BASE_URL}/todos/${USERNAME}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            setNewTask("");
            loadTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`${BASE_URL}/todos/${id}`, {
                method: "DELETE"
            });
            loadTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const clearTasks = async () => {
        try {
            await fetch(`${BASE_URL}/users/${USERNAME}`, { method: "DELETE" });
            await createUser();
            loadTasks();
        } catch (error) {
            console.error("Error clearing tasks:", error);
        }
    };

    useEffect(() => {
        createUser().then(loadTasks);
    }, []);

    return (
        <div className="container mt-5">
            <h1>To-Do List</h1>
            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Add a task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={addTask}>
                    Add
                </button>
            </div>
 
            <button className="btn btn-danger mb-3" onClick={clearTasks}>
                Clear All Tasks
            </button>

            <ul className="list-group">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="list-group-item d-flex justify-content-between"
                    >
                        {task.label}

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteTask(task.id)}
                        >
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
