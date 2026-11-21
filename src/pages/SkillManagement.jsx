
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../services/firebase";

function SkillManagement() {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const skillsRef = collection(db, "skills");

  const fetchSkills = async () => {
    try {
      const snapshot = await getDocs(skillsRef);

      const skillsList = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setSkills(skillsList);
    } catch (error) {
      setMessage("Error loading skills: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const skillData = {
        name: skillName,
        level: skillLevel
      };

      if (editingId) {
        await updateDoc(doc(db, "skills", editingId), skillData);
        setMessage("Skill updated successfully!");
      } else {
        await addDoc(skillsRef, skillData);
        setMessage("Skill added successfully!");
      }

      setSkillName("");
      setSkillLevel("");
      setEditingId(null);

      await fetchSkills();
    } catch (error) {
      setMessage("Error saving skill: " + error.message);
    }
  };

  const handleEdit = (skill) => {
    setSkillName(skill.name);
    setSkillLevel(skill.level);
    setEditingId(skill.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "skills", id));
      setMessage("Skill deleted successfully!");
      await fetchSkills();
    } catch (error) {
      setMessage("Error deleting skill: " + error.message);
    }
  };

  if (loading) return <p>Loading skills...</p>;

  return (
    <div className="skill-management">
      <h2>Manage My Skills</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Skill Name</label>
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Example: React"
          required
        />

        <label>Skill Level</label>
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          required
        >
          <option value="">Select level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button type="submit">
          {editingId ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      <h3>My Skills</h3>

      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        skills.map((skill) => (
          <div className="skill-item" key={skill.id}>
            <div>
              <strong>{skill.name}</strong>
              <p>{skill.level}</p>
            </div>

            <button onClick={() => handleEdit(skill)}>
              Edit
            </button>

            <button onClick={() => handleDelete(skill.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SkillManagement;
