import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Music,
  Users,
  Plus,
  Trash2,
  Mic,
  Drum,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  QrCode,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { registrationAPI } from '@/services/api';

const EMPTY_MEMBER = { name: '', role: '' };

export default function RegistrationPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [hasExistingRegistration, setHasExistingRegistration] = useState(false);

  const [form, setForm] = useState({
    team_name: '',
    college_name: '',
    team_leader_name: '',
    team_leader_email: '',
    team_leader_phone: '',
    team_members: [
      { name: '', role: '' },
      { name: '', role: '' },
      { name: '', role: '' },
      { name: '', role: '' },
    ],
    num_microphones: 2,
    drum_setup: '',
    additional_requirements: '',
    instagram_handle: '',
    transaction_id: '',
  });

  // Check if user already has a registration (block new registration, allow edit)
  useEffect(() => {
    const checkExisting = async () => {
      if (editId) {
        // Editing existing — load it
        try {
          const { data } = await registrationAPI.getById(editId);
          if (data.success) {
            const reg = data.data;
            setForm({
              team_name: reg.team_name || '',
              college_name: reg.college_name || '',
              team_leader_name: reg.team_leader_name || '',
              team_leader_email: reg.team_leader_email || '',
              team_leader_phone: reg.team_leader_phone || '',
              team_members: Array.isArray(reg.team_members) && reg.team_members.length >= 4
                ? reg.team_members
                : [...(reg.team_members || []), ...Array(4).fill(EMPTY_MEMBER)].slice(0, Math.max(4, reg.team_members?.length || 4)),
              num_microphones: reg.num_microphones || 2,
              drum_setup: reg.drum_setup || '',
              additional_requirements: reg.additional_requirements || '',
              instagram_handle: reg.instagram_handle || '',
              transaction_id: reg.transaction_id || '',
            });
            setRegistrationData(reg);
          }
        } catch (err) {
          setError('Failed to load registration data.');
        } finally {
          setFetchLoading(false);
        }
      } else {
        // New registration — check if user already registered
        try {
          const { data } = await registrationAPI.getMyRegistrations();
          if (data.success && data.data && data.data.length > 0) {
            setHasExistingRegistration(true);
          }
        } catch {
          // Ignore — let them proceed
        } finally {
          setFetchLoading(false);
        }
      }
    };

    checkExisting();
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...form.team_members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setForm({ ...form, team_members: newMembers });
  };

  const addMember = () => {
    if (form.team_members.length >= 10) return;
    setForm({ ...form, team_members: [...form.team_members, { ...EMPTY_MEMBER }] });
  };

  const removeMember = (index) => {
    if (form.team_members.length <= 4) return;
    const newMembers = form.team_members.filter((_, i) => i !== index);
    setForm({ ...form, team_members: newMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Manual validation
    if (!form.team_name.trim() || form.team_name.trim().length < 2) {
      setError('Team / Band Name is required (at least 2 characters).');
      setLoading(false);
      return;
    }
    if (!form.college_name.trim() || form.college_name.trim().length < 2) {
      setError('College Name is required (at least 2 characters).');
      setLoading(false);
      return;
    }
    if (!form.team_leader_name.trim() || form.team_leader_name.trim().length < 2) {
      setError('Leader Name is required (at least 2 characters).');
      setLoading(false);
      return;
    }
    if (!form.team_leader_email.trim() || !/\S+@\S+\.\S+/.test(form.team_leader_email)) {
      setError('A valid Leader Email is required.');
      setLoading(false);
      return;
    }
    if (!form.team_leader_phone.trim() || !/^[0-9]{10}$/.test(form.team_leader_phone)) {
      setError('Leader Phone must be a 10-digit number.');
      setLoading(false);
      return;
    }
    if (!form.drum_setup.trim()) {
      setError('Drum Setup is required (enter "none" if not needed).');
      setLoading(false);
      return;
    }
    if (!form.transaction_id.trim()) {
      setError('Transaction / UTR ID is required. Please make the payment and enter the transaction ID.');
      setLoading(false);
      return;
    }

    // Validate team members
    const validMembers = form.team_members.filter((m) => m.name.trim() && m.role.trim());
    if (validMembers.length < 1) {
      setError('At least one team member with name and role is required.');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      team_members: validMembers,
      num_microphones: parseInt(form.num_microphones, 10),
    };

    try {
      if (editId) {
        const { data } = await registrationAPI.update(editId, payload);
        if (data.success) {
          setSuccess(true);
          setRegistrationData(data.data);
        }
      } else {
        const { data } = await registrationAPI.register(payload);
        if (data.success) {
          setSuccess(true);
          setRegistrationData(data.data);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {editId ? 'Registration Updated!' : 'Registration Successful!'}
          </h2>
          <p className="text-gray-400">
            {editId
              ? 'Your band registration has been updated successfully.'
              : 'Your band has been registered for SARGAM 2026. Please complete the payment of ₹1,200 to confirm your spot.'}
          </p>

          {registrationData && (
            <Card className="bg-slate-900/60 border-white/10 text-left">
              <CardContent className="pt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Team</span>
                  <span className="text-white font-medium">{registrationData.team_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Registration ID</span>
                  <span className="text-white font-mono text-xs">{registrationData.registration_id?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-neon-gold font-medium">₹{registrationData.registration_fee || 1200}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-amber-400">{registrationData.registration_status}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated && (
              <Button variant="neon" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
            <Button variant="neon-outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading registration...</p>
        </div>
      </div>
    );
  }

  // Show message if user already has a registration (and not in edit mode)
  if (hasExistingRegistration && !editId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Already Registered</h2>
          <p className="text-gray-400">
            You have already registered a band. Only one registration per user is allowed. You can edit your existing registration from the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="neon" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="neon-outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">
                    {editId ? 'Edit Registration' : 'Band Registration'}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    AAROHA 2026 – SARGAM | Registration Fee: ₹1,200
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                {/* Team Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-400 uppercase tracking-wider">
                    <Music className="w-4 h-4" />
                    Team Details
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Team / Band Name *</Label>
                      <Input
                        name="team_name"
                        value={form.team_name}
                        onChange={handleChange}
                        placeholder="e.g. The Rockers"
                        required
                        minLength={2}
                        maxLength={100}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">College Name *</Label>
                      <Input
                        name="college_name"
                        value={form.college_name}
                        onChange={handleChange}
                        placeholder="e.g. XYZ Engineering College"
                        required
                        minLength={2}
                        maxLength={200}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Team Leader Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    Team Leader Details
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-gray-300">Leader Name *</Label>
                      <Input
                        name="team_leader_name"
                        value={form.team_leader_name}
                        onChange={handleChange}
                        placeholder="Full name"
                        required
                        minLength={2}
                        maxLength={100}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Leader Email *</Label>
                      <Input
                        type="email"
                        name="team_leader_email"
                        value={form.team_leader_email}
                        onChange={handleChange}
                        placeholder="leader@email.com"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Leader Phone *</Label>
                      <Input
                        name="team_leader_phone"
                        value={form.team_leader_phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        required
                        pattern="[0-9]{10}"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-pink-400 uppercase tracking-wider">
                      <Users className="w-4 h-4" />
                      Team Members ({form.team_members.length}/10)
                    </div>
                    {form.team_members.length < 10 && (
                      <Button
                        type="button"
                        variant="neon-outline"
                        size="sm"
                        onClick={addMember}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Member
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    Minimum 4 members, maximum 10. Specify each member&apos;s name and instrument/role.
                  </p>

                  <div className="space-y-3">
                    {form.team_members.map((member, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-500 mt-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            placeholder="Member name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                          />
                          <Input
                            value={member.role}
                            onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                            placeholder="Role (e.g. Lead Guitar, Vocals)"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                          />
                        </div>
                        {form.team_members.length > 4 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMember(index)}
                            className="text-gray-500 hover:text-red-400 mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Technical Requirements */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 uppercase tracking-wider">
                    <Mic className="w-4 h-4" />
                    Technical Requirements
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        Number of Microphones * (1-20)
                      </Label>
                      <Input
                        type="number"
                        name="num_microphones"
                        value={form.num_microphones}
                        onChange={handleChange}
                        min={1}
                        max={20}
                        required
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-1">
                        <Drum className="w-3 h-3" />
                        Drum Setup *
                      </Label>
                      <Input
                        name="drum_setup"
                        value={form.drum_setup}
                        onChange={handleChange}
                        placeholder='e.g. Full kit with double bass pedal or "none"'
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Additional Requirements (optional)
                    </Label>
                    <Textarea
                      name="additional_requirements"
                      value={form.additional_requirements}
                      onChange={handleChange}
                      placeholder="Any additional equipment or special requirements..."
                      maxLength={1000}
                      rows={3}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {form.additional_requirements.length}/1000
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Band Instagram Handle (optional)</Label>
                    <Input
                      name="instagram_handle"
                      value={form.instagram_handle}
                      onChange={handleChange}
                      placeholder="@yourbandname"
                      maxLength={50}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                    />
                    <p className="text-xs text-gray-500">
                      Share your band&apos;s Instagram for promotion
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Payment Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neon-gold uppercase tracking-wider flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Payment
                  </h3>

                  {/* Fee Info */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Registration Fee</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Per team • Non-refundable
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-neon-gold">₹1,200</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-sm font-medium text-white">Scan to Pay</p>
                    <div className="w-56 h-56 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                      {/* Replace src with your actual QR code image path */}
                      <img
                        src="/payment-qr.png"
                        alt="Payment QR Code"
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-gray-400 gap-2 w-full h-full">
                        <QrCode className="w-12 h-12 text-gray-500" />
                        <span className="text-xs text-gray-500">QR code not found</span>
                        <span className="text-[10px] text-gray-600">Place payment-qr.png in public/</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Pay ₹1,200 via UPI and enter the transaction ID below
                    </p>
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-1">
                      <Receipt className="w-3 h-3" />
                      Transaction / UTR ID *
                    </Label>
                    <Input
                      name="transaction_id"
                      value={form.transaction_id}
                      onChange={handleChange}
                      placeholder="e.g. 123456789012 or UPI ref number"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                    />
                    <p className="text-xs text-gray-500">
                      Enter the UPI transaction ID or UTR number after making the payment
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="neon"
                  size="xl"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {editId ? 'Updating...' : 'Submitting...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {editId ? 'Update Registration' : 'Register Band'}
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
