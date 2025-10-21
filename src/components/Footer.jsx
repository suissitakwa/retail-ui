import React from 'react';

export default function Footer() {
  return (
    <footer className="text-center py-4 bg-light mt-5">
      <p className="mb-0">&copy; {new Date().getFullYear()} RetailUI. All rights reserved.</p>
    </footer>
  );
}
