import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, AlertTriangle, FileText } from 'lucide-react';
import mechanicaxiosInstance from '../../utils/mechanicaxios';
import { toast } from 'react-toastify';

const InspectionForm = ({ bookingId, onReportSubmitted, onCancel }) => {
  const [issues, setIssues] = useState([
    { title: '', description: '', estimatedCost: '', severity: 'Medium', recommendedAction: '' }
  ]);
  const [mechanicNotes, setMechanicNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddIssue = () => {
    setIssues([...issues, { title: '', description: '', estimatedCost: '', severity: 'Medium', recommendedAction: '' }]);
  };

  const handleRemoveIssue = (index) => {
    const newIssues = [...issues];
    newIssues.splice(index, 1);
    setIssues(newIssues);
  };

  const handleIssueChange = (index, field, value) => {
    const newIssues = [...issues];
    newIssues[index][field] = value;
    setIssues(newIssues);
  };

  const calculateTotal = () => {
    return issues.reduce((sum, issue) => sum + (Number(issue.estimatedCost) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (issues.length === 0) {
      toast.error('Please add at least one issue or observation.');
      return;
    }

    // Validate
    for (const issue of issues) {
      if (!issue.title || !issue.estimatedCost) {
        toast.error('All issues must have a title and estimated cost.');
        return;
      }
    }

    try {
      setLoading(true);
      // mechanicaxiosInstance baseURL is /api/mechanic, so we just need /inspection
      await mechanicaxiosInstance.post('/inspection', {
        bookingId,
        issues,
        mechanicNotes
      });
      toast.success('Inspection report submitted successfully.');
      if (onReportSubmitted) onReportSubmitted();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit inspection report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          Vehicle Inspection Report
        </h3>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Estimated Cost</p>
          <p className="text-xl font-bold text-orange-500">₹{calculateTotal()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <AnimatePresence>
            {issues.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 relative"
              >
                <div className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveIssue(index)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Issue Title</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      placeholder="e.g. Worn Brake Pads"
                      value={issue.title}
                      onChange={(e) => handleIssueChange(index, 'title', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Severity</label>
                    <select
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      value={issue.severity}
                      onChange={(e) => handleIssueChange(index, 'severity', e.target.value)}
                    >
                      <option value="Low">Low (Advisory)</option>
                      <option value="Medium">Medium (Attention Needed)</option>
                      <option value="High">High (Immediate Action)</option>
                      <option value="Critical">Critical (Safety Hazard)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Est. Cost (₹)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      placeholder="0.00"
                      min="0"
                      value={issue.estimatedCost}
                      onChange={(e) => handleIssueChange(index, 'estimatedCost', e.target.value)}
                      required
                    />
                  </div>
                   <div>
                    <label className="block text-xs text-gray-400 mb-1">Recommended Action</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      placeholder="e.g. Replace pads & rotors"
                      value={issue.recommendedAction}
                      onChange={(e) => handleIssueChange(index, 'recommendedAction', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description / Notes</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none h-20 resize-none"
                    placeholder="Describe the issue..."
                    value={issue.description}
                    onChange={(e) => handleIssueChange(index, 'description', e.target.value)}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={handleAddIssue}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Problem/Issue
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Mechanic's Overall Summary</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-24"
            placeholder="General observations about the vehicle..."
            value={mechanicNotes}
            onChange={(e) => setMechanicNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors disabled:bg-gray-600 flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting...' : <><Save className="w-5 h-5" /> Submit Inspection Report</>}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InspectionForm;
