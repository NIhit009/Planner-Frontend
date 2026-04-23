export const BASE_URL = process.env.NODE_ENV !== 'production' 
  ? process.env.NEXT_PUBLIC_LOCAL_API_URL 
  : process.env.NEXT_PUBLIC_API_URL;

console.log("Current Environment:", process.env.NODE_ENV);
console.log("Resolved Base URL:", BASE_URL);