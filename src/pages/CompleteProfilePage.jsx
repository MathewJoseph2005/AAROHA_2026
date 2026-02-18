import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, School, Music, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';

export default function CompleteProfilePage() {
  const { user, setUser, markProfileComplete } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    phone: user?.phone || '',
    college_name: user?.college_name || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.phone.trim() || !/^[0-9]{10}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!form.college_name.trim() || form.college_name.trim().length < 2) {
      setError('Please enter your college name (at least 2 characters).');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        name: user?.name || user?.email?.split('@')[0] || '',
        phone: form.phone.trim(),
        college_name: form.college_name.trim(),
      });

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          phone: form.phone.trim(),
          college_name: form.college_name.trim(),
        }));
        markProfileComplete();
        navigate('/dashboard', { replace: true });
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="bg-slate-900/80 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
              <Music className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Almost There!</CardTitle>
            <CardDescription className="text-gray-400">
              Complete your profile to continue to the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  College Name
                </Label>
                <Input
                  name="college_name"
                  value={form.college_name}
                  onChange={handleChange}
                  placeholder="e.g. XYZ Engineering College"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                />
              </div>

              <Button
                type="submit"
                variant="neon"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
