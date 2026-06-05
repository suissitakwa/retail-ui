import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const { setAuthData } = useAuth();

  const [form, setForm] = useState({ firstname: "", lastname: "", address: "" });

  useEffect(() => {
    fetchProfile()
      .then(res => {
        setProfile(res.data);
        setForm({
          firstname: res.data.firstname || "",
          lastname:  res.data.lastname  || "",
          address:   res.data.address   || "",
        });
      })
      .catch(() => {});
  }, []);

  const saveEdits = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await updateProfile({
        firstname: form.firstname,
        lastname:  form.lastname,
        email:     profile.email,
        address:   form.address,
      });
      setProfile(res.data);
      setAuthData(localStorage.getItem("accessToken"), res.data);
      setEditing(false);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
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
    <>
      <div className="site-main" style={{ maxWidth: 720 }}>
        <h2 className="page-title">Your Account</h2>

        <div className="profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(232,196,106,0.15)', border: '1px solid rgba(232,196,106,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                {profile.firstname?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>{profile.firstname} {profile.lastname}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{profile.role?.replace('ROLE_', '')}</p>
              </div>
            </div>
            <button className="add-btn" onClick={() => setEditing(true)}>Edit profile</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Field label="First Name" value={profile.firstname} />
            <Field label="Last Name"  value={profile.lastname} />
            <Field label="Email"      value={profile.email} span />
            <Field label="Shipping Address" value={profile.address || 'Not provided'} span />
          </div>
        </div>
      </div>

      {/* Edit drawer */}
      {editing && (
        <div className="drawer-overlay" onClick={() => setEditing(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Edit Profile</h3>
              <button className="drawer-close-btn" onClick={() => setEditing(false)}>✕</button>
            </div>
            <div className="drawer-section">
              {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

              <label>First Name</label>
              <input type="text" value={form.firstname} onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))} />

              <label>Last Name</label>
              <input type="text" value={form.lastname}  onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))} />

              <label>Shipping Address</label>
              <textarea rows={4} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={{ resize: 'vertical' }} />

              <button className="add-btn" style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', fontSize: '14px' }} onClick={saveEdits} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, span }) {
  return (
    <div style={span ? { gridColumn: '1 / -1' } : {}}>
      <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '14px' }}>{value}</p>
    </div>
  );
}
