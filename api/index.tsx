// Import Next.js fetch-related utilities
import { NextResponse } from 'next/server';

// Define User service
export const User = {
  // Commented functions remain commented as in original
  // async getList({
  //   page,
  //   size,
  //   keyword,
  // }: {
  //   page: number;
  //   size: number;
  //   keyword?: string;
  // }): Promise<UserListResponse> {
  //   const response = await API.get(
  //     `/admin/user?page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ""}`,
  //   );
  //   return response.data;
  // },
  // async getAllUserUidList(): Promise<string[]> {
  //   const response = await API.get(`/admin/user?page=0&size=100000000`);
  //   return response.data.content.map((v: UserListItem) => v.id);
  // },

  // We'll add a reissueToken method since it's referenced in the code
  async reissueToken() {
    const response = await fetchWithConfig('/user/reissue', {
      method: 'POST',
    });
    return response;
  }
};

// Base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Main fetch function with configuration
export async function fetchWithConfig(
  url: string, 
  options: RequestInit = {}
) {
  // Set up default headers
  const headers = new Headers(options.headers);
  
  // Handle authorization except for token reissue endpoint
  if (!url.includes('/user/reissue')) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }
  
  // Set up the fetch options with credentials
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Equivalent to withCredentials in axios
  };

  try {
    // Make the fetch request
    const response = await fetch(`${BASE_URL}${url}`, fetchOptions);
    
    // Handle specific error statuses
    if (response.status === 401) {
      if (url === '/user/reissue') {
        window.location.href = '/login';
        localStorage.removeItem('accessToken');
        return;
      } else {
        try {
          const tokenResponse = await User.reissueToken();
          if (tokenResponse && tokenResponse.accessToken) {
            localStorage.setItem('accessToken', tokenResponse.accessToken);
            // Retry the original request (could be implemented)
          }
        } catch (error) {
          console.error('Token reissue failed:', error);
        }
        return;
      }
    }
    
    if (response.status === 502) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }
    
    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse and return the data
    return await response.json();
    
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Convenience methods similar to axios
export const API = {
  get: (url: string, options = {}) => fetchWithConfig(url, { method: 'GET', ...options }),
  post: (url: string, data: any, options = {}) => fetchWithConfig(url, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    ...options 
  }),
  put: (url: string, data: any, options = {}) => fetchWithConfig(url, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    ...options 
  }),
  delete: (url: string, options = {}) => fetchWithConfig(url, { method: 'DELETE', ...options }),
};