
import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Lock, Trash2, Bell, Shield } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handlePasswordChange = () => {
    console.log('Password change requested');
    setShowPasswordChange(false);
  };

  const handleDeleteAccount = () => {
    console.log('Account deletion requested');
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
      
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={() => setShowPasswordChange(true)}
        >
          <Lock className="h-4 w-4" />
          Change Password
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <Bell className="h-4 w-4" />
          Notification Settings
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <Shield className="h-4 w-4" />
          Privacy Settings
        </Button>

        <div className="pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-start gap-3"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};
