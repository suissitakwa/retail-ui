import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const { setAuthData } = useAuth();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    address: ""
  });

  // Load profile
  useEffect(() => {
    fetchProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          address: res.data.address || ""
        });
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const saveEdits = async () => {
    try {
      const payload = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: profile.email,
        address: form.address
      };

      const res = await updateProfile(payload);


     setProfile({ ...res.data });


      setAuthData(localStorage.getItem("accessToken"), res.data);


      setEditing(false);
    } catch (e) {
      alert("Failed to update profile");
    }
  };

  if (!profile) return <p className="p-6">Loading profile…</p>;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
        Your Account
      </h2>

      {/* CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold">Profile Information</h3>

          <button
            className="btn-primary"
            style={{ padding: "8px 14px" }}
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>

        {/* Information */}
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Name:</strong> {profile.firstname} {profile.lastname}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Shipping Address:</strong> <br />
            <span className="text-gray-600">{profile.address || "Not provided"}</span>
          </p>
        </div>
      </div>

      {/* DRAWER */}
      {editing && (
        <div className="drawer-overlay" onClick={() => setEditing(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>

            <div className="drawer-header">
              <h3>Edit Profile</h3>
              <button className="drawer-close-btn" onClick={() => setEditing(false)}>✖</button>
            </div>

            <div className="drawer-section">
              <label className="font-medium">First Name</label>
              <input
                type="text"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              />

              <label className="font-medium mt-3">Last Name</label>
              <input
                type="text"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              />

              <label className="font-medium mt-3">Shipping Address</label>
              <textarea
                className="w-full border rounded-md p-2"
                rows="4"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <button
                className="btn-primary w-full mt-5"
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
