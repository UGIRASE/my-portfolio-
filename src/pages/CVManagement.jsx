
function CVManagement() {
  return (
    <div className="cv-management">
      <h2>CV Management</h2>

      <p>Your CV is stored inside the public folder.</p>

      <p><strong>File:</strong> my-cv.pdf</p>

      <div className="cv-actions">
        <a
          href="/my-cv.pdf?v=20261121"
          target="_blank"
          rel="noopener noreferrer"
          className="view-cv-button"
        >
          View CV
        </a>

        <a
          href="/my-cv.pdf?v=20261121"
          download="My-CV.pdf"
          className="download-cv-button"
        >
          Download CV
        </a>
      </div>
    </div>
  );
}

export default CVManagement;
