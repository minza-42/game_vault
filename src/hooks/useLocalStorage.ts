import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);

      return storedValue !== null
        ? (JSON.parse(storedValue) as T)
        : initialValue;
    } catch (error) {
      console.error("Could not read from LocalStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save to LocalStorage:", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export default useLocalStorage;
