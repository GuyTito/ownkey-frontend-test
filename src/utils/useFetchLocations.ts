import { useCallback, useState } from "react";

export interface TomTomResponse {
  results: Array<{
    type: string;
    position: {
      lat: number;
      lon: number;
    };
  }>;
}
interface UseFetchData<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  fetchData: (vertices: string[]) => void;
  clearData: () => void;
}

interface RequestOptions {
  query: string;
}

export function useFetchLocations<T>({
  query,
}: RequestOptions): UseFetchData<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const url = `https://api.tomtom.com/search/2/geometrySearch/${query}.json?key=${
    import.meta.env.VITE_TOMTOM_API_KEY
  }`;

  const fetchData = async (vertices: string[]) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const requestBody = {
      geometryList: [
        {
          type: "POLYGON",
          vertices,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: T = await response.json();
      setData(data);
      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  return { data, isLoading, error, isSuccess, fetchData, clearData };
}
