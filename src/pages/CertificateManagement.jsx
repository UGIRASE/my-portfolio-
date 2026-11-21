
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

function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [description, setDescription] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "certificates"),
      (snapshot) => {
        const list = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));
        setCertificates(list);
      },
      (error) => {
        setMessage("Error loading certificates: " + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setName("");
    setOrganization("");
    setIssueDate("");
    setDescription("");
    setCertificateUrl("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const certificateData = {
      name: name.trim(),
      organization: organization.trim(),
      issueDate,
      description: description.trim(),
      certificateUrl: certificateUrl.trim(),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(
          doc(db, "certificates", editingId),
          certificateData
        );
        setMessage("Certificate updated successfully!");
      } else {
        await addDoc(collection(db, "certificates"), {
          ...certificateData,
          createdAt: serverTimestamp()
        });
        setMessage("Certificate added successfully!");
      }

      resetForm();
    } catch (error) {
      setMessage("Error saving certificate: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (certificate) => {
    setName(certificate.name || "");
    setOrganization(certificate.organization || "");
    setIssueDate(certificate.issueDate || "");
    setDescription(certificate.description || "");
    setCertificateUrl(certificate.certificateUrl || "");
    setEditingId(certificate.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "certificates", id));
      setMessage("Certificate deleted successfully!");

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setMessage("Error deleting certificate: " + error.message);
    }
  };

  return (
    <div className="certificate-management">
      <h2>Manage Certificates & Achievements</h2>

      {message && <p className="certificate-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Certificate Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Example: Web Development Certificate"
          required
        />

        <label>Issuing Organization</label>
        <input
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Example: Coursera"
          required
        />

        <label>Issue Date</label>
        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your certificate"
          rows="4"
        />

        <label>Certificate Link</label>
        <input
          type="url"
          value={certificateUrl}
          onChange={(e) => setCertificateUrl(e.target.value)}
          placeholder="https://example.com/certificate"
        />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
            ? "Update Certificate"
            : "Add Certificate"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Editing
          </button>
        )}
      </form>

      <h3>My Certificates ({certificates.length})</h3>

      {certificates.length === 0 ? (
        <p>No certificates added yet.</p>
      ) : (
        certificates.map((certificate) => (
          <div className="certificate-item" key={certificate.id}>
            <h3>{certificate.name}</h3>
            <p>
              <strong>Organization:</strong> {certificate.organization}
            </p>
            <p>
              <strong>Issue Date:</strong> {certificate.issueDate}
            </p>
            <p>{certificate.description}</p>

            {certificate.certificateUrl && (
              <a
                href={certificate.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificate
              </a>
            )}

            <div className="certificate-actions">
              <button onClick={() => handleEdit(certificate)}>
                Edit
              </button>

              <button
                className="delete-certificate-button"
                onClick={() => handleDelete(certificate.id)}
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

export default CertificateManagement;
