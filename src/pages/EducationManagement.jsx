
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

function EducationManagement() {
  const [education, setEducation] = useState([]);
  const [institution, setInstitution] = useState("");
  const [qualification, setQualification] = useState("");
  const [field, setField] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "education"),
      (snapshot) => {
        setEducation(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
      },
      (error) => {
        setMessage("Error loading education: " + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setInstitution("");
    setQualification("");
    setField("");
    setStartYear("");
    setEndYear("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const data = {
      institution: institution.trim(),
      qualification: qualification.trim(),
      field: field.trim(),
      startYear,
      endYear,
      description: description.trim(),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "education", editingId), data);
        setMessage("Education updated successfully!");
      } else {
        await addDoc(collection(db, "education"), {
          ...data,
          createdAt: serverTimestamp()
        });
        setMessage("Education added successfully!");
      }

      resetForm();
    } catch (error) {
      setMessage("Error saving education: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setInstitution(item.institution || "");
    setQualification(item.qualification || "");
    setField(item.field || "");
    setStartYear(item.startYear || "");
    setEndYear(item.endYear || "");
    setDescription(item.description || "");
    setEditingId(item.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education record?")) return;

    try {
      await deleteDoc(doc(db, "education", id));
      setMessage("Education deleted successfully!");
      if (editingId === id) resetForm();
    } catch (error) {
      setMessage("Error deleting education: " + error.message);
    }
  };

  return (
    <div className="education-management">
      <h2>Manage My Education</h2>

      {message && <p className="education-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Institution Name</label>
        <input
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Example: University Name"
          required
        />

        <label>Qualification</label>
        <input
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          placeholder="Example: Bachelor's Degree"
          required
        />

        <label>Field of Study</label>
        <input
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="Example: Information Technology"
          required
        />

        <label>Start Year</label>
        <input
          type="number"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          placeholder="2023"
          required
        />

        <label>End Year</label>
        <input
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          placeholder="2026 or Present"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your studies"
          rows="4"
        />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
            ? "Update Education"
            : "Add Education"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Editing
          </button>
        )}
      </form>

      <h3>My Education ({education.length})</h3>

      {education.map((item) => (
        <div className="education-item" key={item.id}>
          <h3>{item.qualification}</h3>
          <p><strong>Institution:</strong> {item.institution}</p>
          <p><strong>Field:</strong> {item.field}</p>
          <p>
            <strong>Period:</strong> {item.startYear} - {item.endYear}
          </p>
          <p>{item.description}</p>

          <div className="education-actions">
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button
              className="delete-education-button"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EducationManagement;
