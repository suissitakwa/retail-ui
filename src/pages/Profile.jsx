import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../api';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile()
      .then(res => setProfile(res.data))
      .catch(err => console.error('Failed to fetch profile', err));
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="mb-4">Profile</h2>
      <p><strong>Name:</strong> {profile.fullName || 'N/A'}</p>
      <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
    </div>
  );
}
