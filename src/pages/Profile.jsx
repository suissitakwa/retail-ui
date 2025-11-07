import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../api';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile()
      .then(res => {
        console.log('Profile response:', res.data);
        setProfile(res.data);
      })
      .catch(err => console.error('Failed to fetch profile', err));
  }, []);

  if (!profile || !profile.email) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profile</h2>
      <p><strong>Name:</strong> {profile.firstname} {profile.lastname}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
}
