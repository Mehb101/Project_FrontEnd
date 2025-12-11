import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import type { Project } from "../types";

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // edit form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Project[]>("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setError(null);
    try {
      const res = await api.post<Project>("/projects", {
        name,
        description,
      });
      setProjects((prev) => [...prev, res.data]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project._id);
    setEditName(project.name);
    setEditDescription(project.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUpdateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    setError(null);
    try {
      const res = await api.put<Project>(`/projects/${editingId}`, {
        name: editName,
        description: editDescription,
      });
      const updated = res.data;
      setProjects((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      setError("Failed to update project.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Delete this project and its tasks?")) return;
    setError(null);
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete project.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Projects</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {}
      {editingId ? (
        <form
          onSubmit={handleUpdateProject}
          className="mb-6 bg-white rounded shadow p-4 space-y-3"
        >
          <h2 className="text-lg font-semibold mb-1">Edit Project</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
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
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelEdit}
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
      ) : (
        <form
          onSubmit={handleCreateProject}
          className="mb-6 bg-white rounded shadow p-4 space-y-3"
        >
          <h2 className="text-lg font-semibold mb-1">Create New Project</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-slate-800 text-white text-sm"
          >
            Create Project
          </button>
        </form>
      )}

      {}
      {loading ? (
        <p className="text-sm text-slate-600">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-slate-600">You have no projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-xs text-slate-600">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <Link
                  to={`/projects/${project._id}`}
                  className="px-3 py-1 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => startEdit(project)}
                  className="px-3 py-1 rounded bg-slate-600 text-white hover:bg-slate-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(project._id)}
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
  );
};

export default DashboardPage;
