"use client"; // This directive is key!

import { useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useAppStore } from '@/lib/store';

interface CustomJwtPayload extends JwtPayload {
  role: string;
}

export function AuthInitializer() {
  const setLoggedInRole = useAppStore((state) => state.setLoggedInRole);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setLoggedInRole(decoded.role);
      } catch (err) {
        console.error("Failed to decode token on mount", err);
      }
    }
  }, [setLoggedInRole]);

  return null; // This component doesn't render anything
}