
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function ProfileManagement() {
  const [profile, setProfile] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    linkedin: "",
    github: "",
    instagram: "",
    whatsapp: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRef = doc(db, "profiles", "main");
        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {
          setProfile((previous) => ({
            ...previous,
            ...snapshot.data()
          }));
        }
      } catch (error) {
        setMessage("Error loading profile: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("Saving profile...");

      await setDoc(doc(db, "profiles", "main"), {
        ...profile,
        updatedAt: new Date().toISOString()
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("Error saving profile: " + error.message);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="management-section">
      <h2>Profile Management</h2>

      <p>Update your personal information and social media links.</p>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="management-form">

        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          required
        />

        <label>Professional Title</label>
        <input
          type="text"
          name="title"
          value={profile.title}
          onChange={handleChange}
          placeholder="Example: Software Developer"
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
        />

        <label>About Me</label>
        <textarea
          name="about"
          value={profile.about}
          onChange={handleChange}
          rows="5"
        />

        <h3>Social Media Accounts</h3>

        <label>LinkedIn Profile URL</label>
        <input
          type="url"
          name="linkedin"
          value={profile.linkedin}
          onChange={handleChange}
          placeholder="https://www.linkedin.com/in/your-profile"
        />

        <label>GitHub Profile URL</label>
        <input
          type="url"
          name="github"
          value={profile.github}
          onChange={handleChange}
          placeholder="https://github.com/your-username"
        />

        <label>Instagram Profile URL</label>
        <input
          type="url"
          name="instagram"
          value={profile.instagram}
          onChange={handleChange}
          placeholder="https://www.instagram.com/your-username"
        />

        <label>WhatsApp Number</label>
        <input
          type="tel"
          name="whatsapp"
          value={profile.whatsapp}
          onChange={handleChange}
          placeholder="Example: +2507XXXXXXXX"
        />

        <button type="submit">
          Save Profile
        </button>

      </form>
    </div>
  );
}

export default ProfileManagement;
