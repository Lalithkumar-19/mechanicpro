import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance';
import TimelineItem from './TimelineItem';
import { Car, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceTimeline = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/user/service-history');
      setHistoryData(data);
      if (data.length > 0 && !selectedCarId) {
        setSelectedCarId(data[0].carId);
      }
    } catch (error) {
      console.error('Error fetching service history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const selectedCarHistory = historyData.find(car => car.carId === selectedCarId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400">Loading your service history...</p>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
        <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Service History</h3>
        <p className="text-gray-400">You haven't had any services recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Service History</h3>
          <p className="text-gray-400">Track maintenance timeline for all your vehicles</p>
        </div>
        <button 
          onClick={fetchHistory}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Car Selector */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {historyData.map(car => (
          <button
            key={car.carId}
            onClick={() => setSelectedCarId(car.carId)}
            className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 min-w-[200px] ${
              selectedCarId === car.carId
                ? 'bg-orange-500/10 border-orange-500 ring-1 ring-orange-500'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedCarId === car.carId ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              <Car className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className={`font-semibold ${selectedCarId === car.carId ? 'text-white' : 'text-gray-300'}`}>
                {car.carName}
              </p>
              <p className="text-xs text-gray-500">{car.licensePlate}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-gray-900/30 p-4 md:p-8 rounded-3xl border border-gray-800">
        {selectedCarHistory?.services.length > 0 ? (
          <div className="max-w-3xl">
            {selectedCarHistory.services.map((service, index) => (
              <TimelineItem 
                key={service.bookingId} 
                service={service} 
                isLast={index === selectedCarHistory.services.length - 1} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white">No services found</h4>
            <p className="text-gray-500 mt-2">No service records for this vehicle yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceTimeline;
