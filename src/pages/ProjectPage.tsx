import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import type { Project, Task, TaskStatus } from "../types";

const statusOptions: TaskStatus[] = ["todo", "in-progress", "done"];

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("todo");

  
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("todo");

  const loadData = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get<Project>(`/projects/${projectId}`),
        api.get<Task[]>(`/projects/${projectId}/tasks`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load project or tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
  }, [projectId]);

  const handleCreateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectId) return;
    if (!taskName.trim() || !taskDescription.trim()) return;
    setError(null);
    try {
      const res = await api.post<Task>(`/projects/${projectId}/tasks`, {
        name: taskName,
        description: taskDescription,
        status: taskStatus,
      });
      setTasks((prev) => [...prev, res.data]);
      setTaskName("");
      setTaskDescription("");
      setTaskStatus("todo");
    } catch (err) {
      console.error(err);
      setError("Failed to create task.");
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task._id);
    setEditName(task.name);
    setEditDescription(task.description);
    setEditStatus(task.status);
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUpdateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTaskId) return;
    setError(null);
    try {
      const res = await api.put<Task>(`/tasks/${editingTaskId}`, {
        name: editName,
        description: editDescription,
        status: editStatus,
      });
      const updated = res.data;
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      cancelEditTask();
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;
    setError(null);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Project Details</h1>
        <Link
          to="/"
          className="text-xs px-3 py-1 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-slate-600">Loading...</p>}

      {}
      {!loading && project && (
        <div className="mb-6 bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-1">{project.name}</h2>
          <p className="text-sm text-slate-700">{project.description}</p>
        </div>
      )}

      {}
      {!loading && project && !editingTaskId && (
        <form
          onSubmit={handleCreateTask}
          className="mb-6 bg-white rounded shadow p-4 space-y-3"
        >
          <h3 className="text-lg font-semibold">Add Task</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-slate-800 text-white text-sm"
          >
            Add Task
          </button>
        </form>
      )}

      {}
      {editingTaskId && (
        <form
          onSubmit={handleUpdateTask}
          className="mb-6 bg-white rounded shadow p-4 space-y-3"
        >
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelEditTask}
              className="px-3 py-1 rounded border border-slate-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-slate-800 text-white text-sm"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {}
      {!loading && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-600">No tasks yet.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-white rounded shadow p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{task.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 uppercase tracking-wide">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => startEditTask(task)}
                      className="px-3 py-1 rounded bg-slate-600 text-white hover:bg-slate-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
