import { useState, useEffect } from 'react';
import inventoryService from '../services/inventoryService'; // (Profile-related functions are here)
import { useAuth } from '../context/AuthContext'; // To get the user email

// Type for user profile data
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string; // Image may or may not exist
}

const ProfilePage = () => {
  // --- State ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null); // New image file
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useAuth(); // Get the user's email from the navbar (optional)

  // --- Effect ---
  // When the page loads, fetch user data
  useEffect(() => {
    fetchProfile();
  }, []);

  // --- Functions ---
  const fetchProfile = async () => {
    try {
      const data = await inventoryService.getUserProfile();
      setProfile(data);
      setName(data.name); // Pre-fill the name field in the form
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Handle form submission (Update logic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Call the service method
      await inventoryService.updateUserProfile(name, profileImage);
      setIsLoading(false);
      setSuccess('Profile updated successfully!');
      
      // Refresh profile data to show the updates
      fetchProfile(); 
      // Reset the file input
      setProfileImage(null);
      (e.target as HTMLFormElement).reset();
      
      // TODO: To update the name shown in the Navbar, you could refresh the page
      // window.location.reload();
      // (Better approach: add a 'refetchUser' function inside AuthContext)
      
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to update profile');
    }
  };

  // --- JSX ---
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
      
      {/* Profile Update Form */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        
        {/* Display the current profile image */}
        <div className="flex items-center space-x-4 mb-6">
          <img 
            // If 'profile.profileImageUrl' exists, show it; otherwise, show a default avatar
            src={profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${name}&background=indigo&color=fff`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold">{profile?.name}</h3>
            <p className="text-gray-500">{profile?.email}</p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Cannot be changed)</label>
              <input
                type="email"
                value={profile?.email || user?.email || ''}
                disabled // Email cannot be changed
                className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Profile Picture</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-lg w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;