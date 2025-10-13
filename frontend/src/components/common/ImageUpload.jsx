import React, { useState } from 'react';
import api from '../../services/api';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const ImageUpload = ({ onUploadSuccess, initialImage }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(initialImage || null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        
        setUploading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/api/upload', formData, config);
            setImagePreview(data.image);
            onUploadSuccess(data.image);
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };
    
    const removeImage = () => {
        setImagePreview(null);
        onUploadSuccess(null); // Notify parent component that image is removed
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Featured Image (Optional)</label>
            <div className="mt-1 flex items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-md">
                {imagePreview ? (
                    <div className="relative group">
                        <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-md object-cover"/>
                        <button 
                            onClick={removeImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        {uploading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleUpload} accept="image/*" />
                                </label>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default ImageUpload;
