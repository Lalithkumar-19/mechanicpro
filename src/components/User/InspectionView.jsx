import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance';
import mechanicaxiosInstance from '../../utils/mechanicaxios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';

const InspectionView = ({ bookingId, onDecisionMade, readOnly = false, isMechanic = false }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [userNotes, setUserNotes] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        let data;
        if (isMechanic) {
          // Mechanic Endpoint: /api/mechanic/inspection/:bookingId
          const response = await mechanicaxiosInstance.get(`/inspection/${bookingId}`);
          data = response.data;
        } else {
          // User Endpoint: /api/user/inspection/:bookingId  (Note: axiosInstance base is /api)
          const response = await axiosInstance.get(`/user/inspection/${bookingId}`);
          data = response.data;
        }
        setReport(data);
      } catch (error) {
        console.error('Error fetching inspection report:', error);
        // If 404, it just means no report yet, handled by parent usually or shows 'Pending'
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchReport();
  }, [bookingId]);

  const handleDecision = async (decision) => {
    try {
      setDecisionLoading(true);
      await axiosInstance.post(`/user/inspection/${report._id}/decision`, {
        decision, // 'approved' or 'rejected'
        userNotes
      });
      
      toast.success(decision === 'approved' ? 'Service plan approved!' : 'Service plan rejected.');
      
      // Update local state to reflect decision immediately
      setReport(prev => ({ ...prev, status: decision }));
      
      if (onDecisionMade) onDecisionMade();
    } catch (error) {
      console.error('Error submitting decision:', error);
      toast.error('Failed to submit decision.');
    } finally {
      setDecisionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading inspection details...</div>;

  if (!report) return null; // Or a message saying "Inspection Pending"

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Inspection Report
            </h3>
            <p className="text-gray-400 text-sm mt-1">Review the issues found by your mechanic</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              report.status === 'approved' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
              report.status === 'rejected' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
              'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            }`}>
              {report.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Issues List */}
        <div className="space-y-4">
          {report.issues.map((issue, index) => (
            <div key={index} className={`rounded-xl border ${getSeverityColor(issue.severity)} p-4`}>
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedIssue(expandedIssue === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${getSeverityColor(issue.severity).split(' ')[0]}`} />
                  <div>
                    <h4 className="font-semibold text-white">{issue.title}</h4>
                    <p className="text-xs text-gray-400">{issue.severity} Severity</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white">₹{issue.estimatedCost}</span>
                  {expandedIssue === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedIssue === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-gray-700/50 text-sm space-y-2">
                      <p><span className="text-gray-400">Description:</span> <span className="text-gray-200">{issue.description}</span></p>
                      <p><span className="text-gray-400">Recommended:</span> <span className="text-gray-200">{issue.recommendedAction}</span></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Total Cost */}
        <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-gray-700">
          <span className="text-gray-400">Total Estimated Cost</span>
          <span className="text-2xl font-bold text-orange-500">₹{report.totalEstimatedCost}</span>
        </div>

        {/* Mechanic Notes */}
        {report.mechanicNotes && (
          <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Mechanic's Notes</h5>
            <p className="text-gray-300 text-sm">{report.mechanicNotes}</p>
          </div>
        )}

        {/* Actions (Only if Pending and NOT Read Only) */}
        {report.status === 'pending' && !readOnly && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Add Note (Optional)</label>
              <textarea
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-20"
                placeholder="Any questions or comments..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleDecision('approved')}
                disabled={decisionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {decisionLoading ? 'Processing...' : <><CheckCircle className="w-5 h-5" /> Approve Repairs</>}
              </button>
              <button
                onClick={() => handleDecision('rejected')}
                 disabled={decisionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {decisionLoading ? 'Processing...' : <><XCircle className="w-5 h-5" /> Reject Repairs</>}
              </button>
            </div>
             <p className="text-center text-xs text-gray-500">
                Approving will allow the mechanic to begin work immediately.
              </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionView;
