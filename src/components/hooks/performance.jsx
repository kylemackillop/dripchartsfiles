import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Custom hook for optimized entity list management
 * Provides caching, loading states, and efficient re-fetching
 */
export function useEntityList(Entity, filters = {}, sortBy = '-created_date', limit = 50) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Memoize filter key for caching
  const filterKey = useMemo(() => 
    JSON.stringify({ filters, sortBy, limit }), 
    [filters, sortBy, limit]
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let result;
      if (Object.keys(filters).length > 0) {
        result = await Entity.filter(filters, sortBy, limit);
      } else {
        result = await Entity.list(sortBy, limit);
      }
      
      setData(result);
      setLastFetch(Date.now());
    } catch (err) {
      console.error(`Error fetching ${Entity.name || 'entity'} data:`, err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [Entity, filterKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastFetch && Date.now() - lastFetch > 300000) { // 5 minutes
        fetchData();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchData, lastFetch]);

  return {
    data,
    isLoading,
    error,
    refresh,
    lastFetch
  };
}

/**
 * Custom hook for single entity management with caching
 */
export function useEntity(Entity, id, dependencies = []) {
  const [entity, setEntity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntity = useCallback(async () => {
    if (!id) {
      setEntity(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await Entity.get(id);
      setEntity(result);
    } catch (err) {
      console.error(`Error fetching ${Entity.name || 'entity'}:`, err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [Entity, id, ...dependencies]);

  useEffect(() => {
    fetchEntity();
  }, [fetchEntity]);

  const refresh = useCallback(() => {
    fetchEntity();
  }, [fetchEntity]);

  return {
    entity,
    isLoading,
    error,
    refresh
  };
}

/**
 * Custom hook for optimized user-specific data fetching
 */
export function useUserData(user, Entity, additionalFilters = {}) {
  const filters = useMemo(() => ({
    created_by: user?.email,
    ...additionalFilters
  }), [user?.email, additionalFilters]);

  return useEntityList(
    Entity, 
    user ? filters : {}, 
    '-created_date', 
    100
  );
}

/**
 * Debounced search hook for better performance
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing local storage with React state
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}