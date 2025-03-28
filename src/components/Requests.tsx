import { HandleLogin } from "./Auth";

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

const API_URL = import.meta.env.VITE_SERVER_URL;

const getToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem('@storage_Key');
  } catch (error) {
    console.error("Error fetching token from storage:", error);
    return null;
  }
};

const fetchFromApi = async (path: string, { method, body }: RequestOptions): Promise<any> => {
  try {
    let authToken = await getToken();

    if (!authToken) {
      console.log("No token found, attempting login...");
      await HandleLogin();
      authToken = await getToken();

      if (!authToken) {
        throw new Error("Unable to retrieve token after login.");
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    };

    const config: RequestInit = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(`${API_URL}/${path}`, config);

    if (response.status === 401) {
      await HandleLogin()
    } else if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`API Error (${response.status}): ${errorDetails}`);
      throw new Error(`Error ${response.status}: ${errorDetails}`);
    } 

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error(`Request failed (${method} ${path}):`, error);
    throw error;
  }
};

export const GET = async (path: string): Promise<any> => {
  return fetchFromApi(path, { method: 'GET' });
};

export const POST = async (path: string, content: any): Promise<any> => {
  return fetchFromApi(path, { method: 'POST', body: content });
};

export const PUT = async (path: string, content: any): Promise<any> => {
  return fetchFromApi(path, { method: 'PUT', body: content });
};

export const DELETE = async (path: string, content: any): Promise<any> => {
  return fetchFromApi(path, { method: 'DELETE', body: content });
};
