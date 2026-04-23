console.log(process.env.NEXT_LOCAL_API_URL)
console.log(process.env.NEXT_PUBLIC_API_URL)
export const BASE_URL = process.env.NEXT_NODE_VALUE === 'production' ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_LOCAL_API_URL;