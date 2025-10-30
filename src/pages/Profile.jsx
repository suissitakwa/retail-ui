import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:8080/api/customer/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error('Failed to fetch profile', err));
  }, [token]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="mb-4">Profile</h2>
      <p><strong>Name:</strong> {profile.fullName || `${profile.firstname} ${profile.lastname}`}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
}
