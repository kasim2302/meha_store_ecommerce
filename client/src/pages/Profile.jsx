import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail, Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile');
    } else {
      setName(user.name);
      if (user.profilePicture) {
        setPreviewUrl(user.profilePicture);
      }
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('name', name);
    if (password) formData.append('password', password);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setPassword(''); // Clear password field
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
    
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Profile Settings</h1>
      
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
        
        {message.text && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500 mt-1">Upload a new picture to personalize your account.</p>
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-gray-100">
            {/* Email (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Your email address cannot be changed.</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-sm"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
