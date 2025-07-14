
import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Edit2, MapPin, Mail, Calendar } from 'lucide-react';
import { User as UserType } from '@/types/User';
import { useProfile } from '@/hooks/useProfile';

interface ProfileInfoProps {
  user: UserType;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user.fullName,
    email: user.email,
    country: user.country,
    city: user.city
  });
  
  const { updateProfile, updating } = useProfile();

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      fullName: user.fullName,
      email: user.email,
      country: user.country,
      city: user.city
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture} alt={user.fullName} />
            <AvatarFallback className="text-lg">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.fullName || 'No name set'}</h2>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {user.city && user.country ? `${user.city}, ${user.country}` : 'Location not set'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
          disabled={updating}
        >
          <Edit2 className="h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={editData.country}
                onChange={(e) => setEditData({ ...editData, country: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={editData.city}
                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} isLoading={updating}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={updating}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Email:</span>
            <span>{user.email || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Member since:</span>
            <span>{user.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
