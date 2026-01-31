import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { uploadToImgBB } from '../../utils/uploadtoImbb';
import { toast } from 'react-toastify';
import { Switch, FormControlLabel, Button, IconButton, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const CarouselManager = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:3000/api/carousel/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToImgBB(file);
      
      const token = localStorage.getItem('admin_token');
      await axios.post('http://localhost:3000/api/carousel', {
        imageUrl,
        order: slides.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Slide added successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error uploading slide:', error);
      toast.error('Failed to upload slide');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://localhost:3000/api/carousel/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Slide deleted');
      fetchSlides();
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`http://localhost:3000/api/carousel/${id}`, {
        isActive: !currentStatus
      }, {
         headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchSlides();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items locally
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Update orders in backend
    try {
      const token = localStorage.getItem('admin_token');
      // Optimistically update UI
      setSlides(newSlides);

      // In a real production app, you might want to batch this or send the whole list order
      // For now, simpler to just swap the two involved
      await axios.put(`http://localhost:3000/api/carousel/${newSlides[index]._id}`, { order: index }, { headers: { Authorization: `Bearer ${token}` } });
      await axios.put(`http://localhost:3000/api/carousel/${newSlides[targetIndex]._id}`, { order: targetIndex }, { headers: { Authorization: `Bearer ${token}` } });
      
    } catch (error) {
      toast.error('Failed to reorder');
      fetchSlides(); // Revert
    }
  };

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Homepage Carousel</h2>
        <div>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label htmlFor="raised-button-file">
            <Button 
                variant="contained" 
                component="span" 
                disabled={uploading}
                sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
            >
              {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload New Slide'}
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {slides.map((slide, index) => (
          <div key={slide._id} className="flex items-center bg-[#2c2c2c] p-4 rounded-lg shadow-md border border-[#333]">
            <div className="w-32 h-20 flex-shrink-0 mr-4 rounded overflow-hidden">
                <img src={slide.imageUrl} alt="Slide" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow">
               <p className="text-sm text-gray-400">Created: {new Date(slide.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-4">
               <FormControlLabel
                  control={
                    <Switch
                      checked={slide.isActive}
                      onChange={() => handleToggleActive(slide._id, slide.isActive)}
                      color="error"
                    />
                  }
                  label={slide.isActive ? "Active" : "Inactive"}
                />

                <div className="flex flex-col">
                    <IconButton size="small" onClick={() => handleMove(index, 'up')} disabled={index === 0} sx={{ color: 'white' }}>
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleMove(index, 'down')} disabled={index === slides.length - 1} sx={{ color: 'white' }}>
                        <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                </div>

                <IconButton onClick={() => handleDelete(slide._id)} color="error">
                    <DeleteIcon />
                </IconButton>
            </div>
          </div>
        ))}
        {slides.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">No slides found. Upload one to get started.</div>
        )}
      </div>
    </div>
  );
};

export default CarouselManager;
