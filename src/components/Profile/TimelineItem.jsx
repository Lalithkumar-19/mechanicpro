import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Wrench, CheckCircle, Clock4, DollarSign, 
  MapPin, User, ArrowRight 
} from 'lucide-react';

const TimelineItem = ({ service, isLast }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  const formattedDate = new Date(service.serviceDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative flex gap-6 pb-12">
      {/* Vertical Line */}
      {!isLast && (
        <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-700" />
      )}

      {/* Icon / Status Dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`w-12 h-12 rounded-full ${getStatusColor(service.status)}/20 border-2 border-${getStatusColor(service.status)} flex items-center justify-center`}>
          <Wrench className={`w-6 h-6 text-${getStatusColor(service.status)}`} />
        </div>
      </div>

      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex-grow bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/30 transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}/20 text-${getStatusColor(service.status)} border border-${getStatusColor(service.status)}/30`}>
                {service.status.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <h4 className="text-xl font-bold text-white">{service.serviceType}</h4>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white flex items-center justify-end gap-1">
              <span className="text-orange-500">₹</span>
              {service.cost.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>{service.mechanicName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock4 className="w-4 h-4 text-gray-400" />
            <span>Odometer: {service.odometer} km</span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Work Description:</p>
          <p className="text-gray-200">{service.description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
