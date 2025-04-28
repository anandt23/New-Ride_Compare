import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateLocation = useCallback((position: GeolocationPosition) => {
    setLoading(false);
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setError(null);
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setLoading(false);
    setError(error.message);
    
    // If geolocation fails, provide fallback location (Bangalore)
    console.warn("Geolocation error:", error.message);
    console.log("Using fallback location data");
    
    setLocation({
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 1000,
    });
  }, []);

  const triggerGetLocation = useCallback((callback?: (location: Location | null) => void) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      // Provide fallback location
      const fallbackLocation = {
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 1000,
      };
      setLocation(fallbackLocation);
      if (callback) callback(fallbackLocation);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(locationData);
        setLoading(false);
        setError(null);
        if (callback) callback(locationData);
      },
      (error) => {
        setLoading(false);
        setError(error.message);
        
        // Provide fallback location on error
        const fallbackLocation = {
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 1000,
        };
        setLocation(fallbackLocation);
        if (callback) callback(fallbackLocation);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );
  }, []);

  // On mount, try to get the user's location
  useEffect(() => {
    triggerGetLocation();
  }, []);

  return {
    location,
    error,
    loading,
    triggerGetLocation,
  };
}
