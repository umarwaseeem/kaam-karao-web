import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { Card, Button, TextField, Avatar } from '../../components/ui/index.jsx';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [saving, setSaving] = useState(false);

  const isDirty =
    fullName !== (user?.full_name ?? '') ||
    phone !== (user?.phone ?? '') ||
    address !== (user?.address ?? '');

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, phone, address });
      toast.success(t('profile_saved'));
    } catch (err) {
      toast.error(err?.message ?? t('error_generic'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 py-6 max-w-xl mx-auto w-full">
      <h1 className="text-xl font-bold text-on-bg mb-6">{t('profile')}</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
        {/* Avatar */}
        <Card className="p-6 flex flex-col items-center gap-3">
          <Avatar name={user?.full_name ?? user?.email ?? '?'} size={72} />
          <div className="text-center">
            <p className="font-bold text-on-bg text-lg">{user?.full_name ?? 'User'}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </Card>

        {/* Edit form */}
        <Card className="p-5 flex flex-col gap-4">
          <TextField
            label={t('full_name')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
          <TextField
            label={t('email')}
            value={user?.email ?? ''}
            disabled
            placeholder="Email"
          />
          <p className="text-xs text-muted -mt-3">Email cannot be changed</p>
          <TextField
            label={t('phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 3XX XXXXXXX"
            type="tel"
          />
          <TextField
            label={t('address')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your home address"
          />
          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="mt-1"
          >
            {saving ? 'Saving...' : t('save_changes')}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
