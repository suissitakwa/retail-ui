import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const { setAuthData } = useAuth();

  const [form, setForm] = useState({ firstname: "", lastname: "", address: "" });

  useEffect(() => {
    fetchProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          firstname: res.data.firstname,
          lastname:  res.data.lastname,
          address:   res.data.address || "",
        });
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const saveEdits = async () => {
    try {
      const payload = {
        firstname: form.firstname,
        lastname:  form.lastname,
        email:     profile.email,
        address:   form.address,
      };
      const res = await updateProfile(payload);
      setProfile({ ...res.data });
      setAuthData(localStorage.getItem("accessToken"), res.data);
      setEditing(false);
    } catch {
      alert("Failed to update profile");
    }
  };

  if (!profile)
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading profile…</span>
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="page-title">Your Account</h2>

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold fs-4 mb-0">Profile Information</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>

        <div className="space-y-3">
          <p className="mb-2">
            <strong>Name:</strong> {profile.firstname} {profile.lastname}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="mb-0">
            <strong>Shipping Address:</strong><br />
            <span className="text-muted">{profile.address || "Not provided"}</span>
          </p>
        </div>
      </div>

      {/* EDIT DRAWER */}
      {editing && (
        <div className="drawer-overlay" onClick={() => setEditing(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Edit Profile</h3>
              <button className="drawer-close-btn" onClick={() => setEditing(false)}>✖</button>
            </div>

            <div className="drawer-section">
              <label className="font-medium mb-1 d-block">First Name</label>
              <input
                type="text"
                className="mb-3"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              />

              <label className="font-medium mb-1 d-block">Last Name</label>
              <input
                type="text"
                className="mb-3"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              />

              <label className="font-medium mb-1 d-block">Shipping Address</label>
              <textarea
                className="mb-4"
                style={{ width: "100%", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", padding: "10px" }}
                rows="4"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <button
                className="btn btn-primary w-100"
                onClick={saveEdits}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
