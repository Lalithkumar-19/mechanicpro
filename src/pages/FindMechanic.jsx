import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Phone, Star, Filter, Navigation, ChevronLeft, ChevronRight, Map, Car, AlertCircle, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, emoji) => {
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const userIcon = createCustomIcon('#FF6B5A', '📍');
const mechanicIcon = createCustomIcon('#10B981', '🔧');

// Map Controller Component
const MapController = ({ userLocation, mechanicLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && mechanicLocation) {
      const bounds = L.latLngBounds([
        [userLocation.latitude, userLocation.longitude],
        [mechanicLocation.latitude, mechanicLocation.longitude]
      ]);
      map.fitBounds(bounds, { padding: [30, 30] });
    } else if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 13);
    }
  }, [userLocation, mechanicLocation, map]);

  return null;
};

// Distance calculation using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Interactive Map Component
const InteractiveMap = ({ userLocation, selectedMechanic, onClose }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (userLocation && selectedMechanic) {
      setRoute([
        [userLocation.latitude, userLocation.longitude],
        [selectedMechanic.location.latitude, selectedMechanic.location.longitude]
      ]);
    }
  }, [userLocation, selectedMechanic]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-2xl w-full max-w-6xl h-96 lg:h-[600px] relative flex flex-col border border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h3 className="text-white font-bold text-xl">
              {selectedMechanic ? `Route to ${selectedMechanic.name}` : 'Your Location'}
            </h3>
            {selectedMechanic && userLocation && (
              <p className="text-gray-400 text-sm mt-1">
                Distance: {calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  selectedMechanic.location.latitude,
                  selectedMechanic.location.longitude
                )} km • Estimated travel time
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1">
          <MapContainer
            center={userLocation ? [userLocation.latitude, userLocation.longitude] : [19.0760, 72.8777]}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '0 0 1rem 1rem' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapController
              userLocation={userLocation}
              mechanicLocation={selectedMechanic?.location}
            />

            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={userIcon}
              >
                <Popup className="custom-popup">
                  <div className="text-center min-w-[200px]">
                    <strong className="text-gray-900">Your Location</strong>
                    <div className="mt-2 p-2 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        We're showing mechanics based on your current location
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Selected Mechanic Marker */}
            {selectedMechanic && (
              <Marker
                position={[selectedMechanic.location.latitude, selectedMechanic.location.longitude]}
                icon={mechanicIcon}
              >
                <Popup className="custom-popup">
                  <div className="text-center min-w-[200px]">
                    <strong className="text-gray-900">{selectedMechanic.name}</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedMechanic.location.area}, {selectedMechanic.location.city}
                    </p>
                    <p className="text-sm text-orange-500 font-medium mt-2">
                      {selectedMechanic.contact}
                    </p>
                    <div className="mt-2 flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-700">{selectedMechanic.rating}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Line */}
            {route.length > 0 && (
              <Polyline
                positions={route}
                color="#FF6B5A"
                weight={5}
                opacity={0.8}
                dashArray="8, 8"
              />
            )}
          </MapContainer>
        </div>
      </motion.div>
    </div>
  );
};

const FindMechanic = () => {
  const [mechanics, setMechanics] = useState([]);
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rating: '',
    city: '',
    serviceType: '',
    openNow: false,
    distance: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'granted', 'denied', 'default'
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [locationError, setLocationError] = useState('');

  const mechanicsPerPage = 20;

  // Sample mechanics data
  const sampleMechanics = [
    {
      id: 1,
      name: "AutoCare Pro Center",
      contact: "+91 98765 43210",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        area: "Bandra West",
        latitude: 19.0596,
        longitude: 72.8295,
        googleMapsLink: "https://maps.google.com/?q=19.0596,72.8295",
        fullAddress: "Shop No. 12, Linking Road, Bandra West",
        landmark: "Near Bandra Station"
      },
      workingHours: "8:00 AM - 8:00 PM",
      rating: 4.8,
      serviceTypes: ["AC Service", "Engine Repair", "General Service"],
      openNow: true
    },
    {
      id: 2,
      name: "Precision Auto Works",
      contact: "+91 98765 43211",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        area: "Andheri East",
        latitude: 19.1176,
        longitude: 72.8560,
        googleMapsLink: "https://maps.google.com/?q=19.1176,72.8560",
        fullAddress: "G-12, Saki Naka, Andheri East",
        landmark: "Opposite Metro Station"
      },
      workingHours: "9:00 AM - 7:00 PM",
      rating: 4.6,
      serviceTypes: ["Denting & Painting", "Electrical Repairs"],
      openNow: true
    },
    {
      id: 3,
      name: "Elite Car Service",
      contact: "+91 98765 43212",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        area: "Powai",
        latitude: 19.1176,
        longitude: 72.9080,
        googleMapsLink: "https://maps.google.com/?q=19.1176,72.9080",
        fullAddress: "Hiranandani Complex, Powai",
        landmark: "Near Hiranandani Hospital"
      },
      workingHours: "8:30 AM - 8:30 PM",
      rating: 4.9,
      serviceTypes: ["Luxury Package", "Premium Service", "Detailing"],
      openNow: false
    },
    // Add more sample mechanics...
    ...Array.from({ length: 57 }, (_, i) => {
      const baseLat = 19.0760;
      const baseLon = 72.8777;
      const randomLat = baseLat + (Math.random() - 0.5) * 0.2;
      const randomLon = baseLon + (Math.random() - 0.5) * 0.2;

      return {
        id: i + 4,
        name: `City Auto Service ${i + 1}`,
        contact: `+91 98765 ${43213 + i}`,
        location: {
          city: ["Mumbai", "Delhi", "Bangalore"][i % 3],
          state: ["Maharashtra", "Delhi", "Karnataka"][i % 3],
          area: `Area ${i + 1}`,
          latitude: randomLat,
          longitude: randomLon,
          googleMapsLink: `https://maps.google.com/?q=${randomLat},${randomLon}`,
          fullAddress: `Shop No. ${i + 1}, Main Road`,
          landmark: `Near Landmark ${i + 1}`
        },
        workingHours: "9:00 AM - 7:00 PM",
        rating: 4.0 + (i % 5 * 0.2),
        serviceTypes: [["AC Service"], ["Engine Repair"], ["General Service"]][i % 3],
        openNow: i % 2 === 0
      };
    })
  ];

  // Initialize location and mechanics data
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize mechanics without distance first
      const initialMechanics = sampleMechanics.map(mechanic => ({
        ...mechanic,
        distance: null
      }));

      setMechanics(initialMechanics);
      setFilteredMechanics(initialMechanics);

      // Try to get user location automatically
      if (!navigator.geolocation) {
        setLocationStatus('default');
        setLocationError("Geolocation is not supported by your browser.");
        useDefaultLocation();
        return;
      }

      // Browser will show its native permission prompt
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          setLocationStatus('granted');
          setLocationError('');

          // Calculate distances with real location
          const updatedMechanics = initialMechanics.map(mechanic => ({
            ...mechanic,
            distance: calculateDistance(
              location.latitude,
              location.longitude,
              mechanic.location.latitude,
              mechanic.location.longitude
            )
          }));

          setMechanics(updatedMechanics);
          setFilteredMechanics(updatedMechanics);
          setLoading(false);
        },
        (error) => {
          // User denied location or error occurred
          let message = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus('denied');
              message = "Location access denied. Using default location (Mumbai).";
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationStatus('default');
              message = "Location information unavailable. Using default location.";
              break;
            case error.TIMEOUT:
              setLocationStatus('default');
              message = "Location request timed out. Using default location.";
              break;
            default:
              setLocationStatus('default');
              message = "Unable to get location. Using default location.";
              break;
          }

          setLocationError(message);
          useDefaultLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    };

    const useDefaultLocation = () => {
      const defaultLocation = { latitude: 19.0760, longitude: 72.8777 };
      setUserLocation(defaultLocation);

      const updatedMechanics = sampleMechanics.map(mechanic => ({
        ...mechanic,
        distance: calculateDistance(
          defaultLocation.latitude,
          defaultLocation.longitude,
          mechanic.location.latitude,
          mechanic.location.longitude
        )
      }));

      setMechanics(updatedMechanics);
      setFilteredMechanics(updatedMechanics);
      setLoading(false);
    };

    initializeApp();
  }, []);

  // Filter mechanics based on search and filters
  useEffect(() => {
    let result = mechanics;

    // Search filter
    if (searchTerm) {
      result = result.filter(mechanic =>
        mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mechanic.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mechanic.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mechanic.serviceTypes.some(service =>
          service.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(mechanic => mechanic.rating >= parseFloat(filters.rating));
    }

    // City filter
    if (filters.city) {
      result = result.filter(mechanic => mechanic.location.city === filters.city);
    }

    // Service type filter
    if (filters.serviceType) {
      result = result.filter(mechanic =>
        mechanic.serviceTypes.includes(filters.serviceType)
      );
    }

    // Open now filter
    if (filters.openNow) {
      result = result.filter(mechanic => mechanic.openNow);
    }

    // Distance filter
    if (filters.distance && userLocation) {
      const maxDistance = parseFloat(filters.distance);
      result = result.filter(mechanic =>
        mechanic.distance !== null && mechanic.distance <= maxDistance
      );
    }

    setFilteredMechanics(result);
    setCurrentPage(1);
  }, [searchTerm, filters, mechanics, userLocation]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      rating: '',
      city: '',
      serviceType: '',
      openNow: false,
      distance: ''
    });
    setSearchTerm('');
  };

  const getUniqueCities = () => {
    return [...new Set(mechanics.map(mechanic => mechanic.location.city))];
  };

  const getUniqueServiceTypes = () => {
    const allServices = mechanics.flatMap(mechanic => mechanic.serviceTypes);
    return [...new Set(allServices)];
  };

  const handleShowMap = (mechanic = null) => {
    if (!userLocation) {
      setLocationError("Please enable location access to view the map.");
      return;
    }
    setSelectedMechanic(mechanic);
    setShowMap(true);
  };

  // Retry location access
  const retryLocation = () => {
    setLoading(true);
    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        setLocationStatus('granted');
        setLocationError('');

        const updatedMechanics = mechanics.map(mechanic => ({
          ...mechanic,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            mechanic.location.latitude,
            mechanic.location.longitude
          )
        }));

        setMechanics(updatedMechanics);
        setFilteredMechanics(updatedMechanics);
        setLoading(false);
      },
      (error) => {
        setLocationStatus('denied');
        setLocationError("Still unable to access your location. Using default location.");
        setLoading(false);
      }
    );
  };

  // Pagination
  const indexOfLastMechanic = currentPage * mechanicsPerPage;
  const indexOfFirstMechanic = indexOfLastMechanic - mechanicsPerPage;
  const currentMechanics = filteredMechanics.slice(indexOfFirstMechanic, indexOfLastMechanic);
  const totalPages = Math.ceil(filteredMechanics.length / mechanicsPerPage);

  if (loading && locationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Getting your location...</p>
          <p className="text-gray-400 text-sm mt-2">Please allow location access when prompted</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Find Trusted Mechanics
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                Discover  mechanics near you with real-time distance tracking and verified reviews
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end space-y-3">
              {locationStatus === 'granted' ? (
                <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full">
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm font-medium">Live Location Active</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-400 bg-amber-400/10 px-4 py-2 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {locationStatus === 'default' ? 'Default Location' : 'Location Access Required'}
                  </span>
                </div>
              )}

              <button
                onClick={() => handleShowMap()}
                disabled={!userLocation}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                <Map className="w-4 h-4" />
                <span>View Area Map</span>
              </button>
            </div>
          </div>

          {/* Location Error Banner */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-amber-300 text-sm font-medium">{locationError}</p>
                  </div>
                </div>
                {locationStatus === 'denied' && (
                  <button
                    onClick={retryLocation}
                    className="text-amber-400 hover:text-amber-300 text-sm font-medium underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Rest of the component remains the same as previous version */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-4   ">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search mechanics by name, area, city, or service type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 font-medium"
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div className="lg:col-span-2 flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 lg:flex-none flex items-center justify-center space-x-3 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>

              <button
                onClick={clearFilters}
                className="flex-1 lg:flex-none px-6 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-orange-500 rounded-xl transition-all duration-300 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 pt-6 border-t border-gray-700">
                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-medium"
                    >
                      <option value="">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      City
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-medium"
                    >
                      <option value="">All Cities</option>
                      {getUniqueCities().map(city => (
                        <option key={city} value={city} >{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Service Type
                    </label>
                    <select
                      value={filters.serviceType}
                      onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-medium"
                    >
                      <option value="">All Services</option>
                      {getUniqueServiceTypes().map(service => (
                        <option key={service} value={service} className='cursor-pointer'>{service}</option>
                      ))}
                    </select>
                  </div>

                  {/* Distance Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Max Distance
                    </label>
                    <select
                      value={filters.distance}
                      onChange={(e) => handleFilterChange('distance', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-medium"
                    >
                      <option value="" className='cursor-pointers'>Any Distance</option>
                      <option value="5" className='cursor-pointer'>Within 5 km</option>
                      <option value="10" className='cursor-pointer'>Within 10 km</option>
                      <option value="15" className='cursor-pointer'>Within 15 km</option>
                      <option value="20" className='cursor-pointer'>Within 20 km</option>
                      <option value="50" className='cursor-pointer'>Above 20 km</option>
                    </select>
                  </div>

                  {/* Open Now Filter */}
                  <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.openNow}
                          onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                          className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        />
                      </div>
                      <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-200">
                        Open Now
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-3 sm:space-y-0">
          <div>
            <p className="text-gray-400 text-lg">
              Found <span className="text-white font-semibold">{filteredMechanics.length}</span> mechanics
              {userLocation && locationStatus === 'granted' && ' near your location'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {totalPages > 1 && (
              <p className="text-orange-400 font-medium">
                Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
              </p>
            )}
          </div>
        </div>

        {/* Mechanics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentMechanics.map((mechanic) => (
            <motion.div
              key={mechanic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-800 hover:border-orange-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300 leading-tight">
                    {mechanic.name}
                  </h3>
                  <div className="flex items-center space-x-1 bg-gray-800/50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{mechanic.rating}</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{mechanic.contact}</span>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">{mechanic.location.area}, {mechanic.location.city}</p>
                    <p className="text-gray-400 text-sm mt-1">{mechanic.location.landmark}</p>
                  </div>
                </div>

                {/* Distance & Hours */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {mechanic.distance !== null && (
                    <div>
                      <p className="text-orange-400 font-semibold text-lg">
                        {mechanic.distance} km
                      </p>
                      <p className="text-gray-400 text-xs">Distance</p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className={`text-sm font-medium ${mechanic.openNow ? 'text-green-400' : 'text-red-400'}`}>
                        {mechanic.openNow ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Now</p>
                  </div>
                </div>

                {/* Service Types */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {mechanic.serviceTypes.slice(0, 2).map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-lg text-xs font-medium border border-orange-500/30"
                    >
                      {service}
                    </span>
                  ))}
                  {mechanic.serviceTypes.length > 2 && (
                    <span className="px-3 py-1.5 bg-gray-700 text-gray-400 rounded-lg text-xs font-medium border border-gray-600">
                      +{mechanic.serviceTypes.length - 2} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25">
                    Book Service
                  </button>
                  <button
                    onClick={() => handleShowMap(mechanic)}
                    disabled={!userLocation}
                    className="flex items-center justify-center w-12 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-xl transition-colors duration-300 disabled:cursor-not-allowed"
                    title={!userLocation ? "Enable location to view map" : "View on map"}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {currentMechanics.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-orange-400 text-8xl mb-6">🔧</div>
            <h3 className="text-2xl font-bold text-white mb-4">No mechanics found</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Try adjusting your search criteria or filters to find available mechanics in your area.
            </p>
            <button
              onClick={clearFilters}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-3 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-orange-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-xl transition-all duration-300 font-semibold ${currentPage === pageNum
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-3 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-orange-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map Modal */}
      <AnimatePresence>
        {showMap && userLocation && (
          <InteractiveMap
            userLocation={userLocation}
            selectedMechanic={selectedMechanic}
            onClose={() => {
              setShowMap(false);
              setSelectedMechanic(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindMechanic;