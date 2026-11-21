
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";

function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const projectList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setProjects(projectList);
        setLoading(false);
      },
      (error) => {
        console.error("Projects loading error:", error);
        setMessage("Error loading projects: " + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTechnologies("");
    setProjectUrl("");
    setGithubUrl("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      technologies: technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      projectUrl: projectUrl.trim(),
      githubUrl: githubUrl.trim(),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(
          doc(db, "projects", editingId),
          projectData
        );

        setMessage("Project updated successfully!");
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp()
        });

        setMessage("Project added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Project saving error:", error);
      setMessage("Error saving project: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title || "");
    setDescription(project.description || "");
    setTechnologies(
      Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : ""
    );
    setProjectUrl(project.projectUrl || "");
    setGithubUrl(project.githubUrl || "");
    setEditingId(project.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "projects", id));
      setMessage("Project deleted successfully!");

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Project deletion error:", error);
      setMessage("Error deleting project: " + error.message);
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className="projects-management">
      <h2>Manage My Projects</h2>

      {message && <p className="project-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Project Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example: Mini Blog App"
          required
        />

        <label>Project Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project"
          rows="4"
          required
        />

        <label>Technologies</label>
        <input
          type="text"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="React, JavaScript, Firebase"
        />

        <label>Live Project URL</label>
        <input
          type="url"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          placeholder="https://example.com"
        />

        <label>GitHub URL</label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/project"
        />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
              ? "Update Project"
              : "Add Project"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-project-button"
            onClick={resetForm}
          >
            Cancel Editing
          </button>
        )}
      </form>

      <h3>My Projects ({projects.length})</h3>

      {projects.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        projects.map((project) => (
          <div className="project-management-item" key={project.id}>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <p>
                <strong>Technologies:</strong>{" "}
                {Array.isArray(project.technologies)
                  ? project.technologies.join(", ")
                  : ""}
              </p>
            </div>

            <div className="project-management-actions">
              <button onClick={() => handleEdit(project)}>
                Edit
              </button>

              <button
                className="delete-project-button"
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectsManagement;
