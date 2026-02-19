import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Music,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  School,
  LogOut,
  Edit,
  Eye,
  EyeOff,
  CreditCard,
  Users,
  Drum,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { authAPI, registrationAPI } from '@/services/api';

export default function DashboardPage() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedReg, setExpandedReg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, regRes] = await Promise.all([
          authAPI.getProfile().catch(() => null),
          registrationAPI.getMyRegistrations().catch(() => null),
        ]);

        if (profileRes?.data?.success) {
          setProfile(profileRes.data.data.profile);
          setUser((prev) => ({ ...prev, ...profileRes.data.data.profile }));
        }

        if (regRes?.data?.success) {
          setRegistrations(regRes.data.data || []);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success"><CreditCard className="w-3 h-3 mr-1" /> Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'refunded':
        return <Badge variant="info"><CreditCard className="w-3 h-3 mr-1" /> Refunded</Badge>;
      default:
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {profile?.name || user?.name || 'Musician'}! 🎶
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your band registrations for SARGAM 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            {(registrations.length === 0 || registrations.every(r => r.registration_status === 'rejected' || r.payment_status === 'failed')) && (
              <Button variant="neon" asChild>
                <Link to="/register" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Register Band
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl h-full">
              <CardHeader>
                <CardTitle className="text-white text-lg">Your Profile</CardTitle>
                <CardDescription className="text-gray-400">Account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">
                    {(profile?.name || user?.name || '?')[0].toUpperCase()}
                  </span>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-neon-violet" />
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-auto">{profile?.name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-neon-cyan" />
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-auto truncate max-w-[140px]">{profile?.email || user?.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-neon-magenta" />
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white ml-auto">{profile?.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <School className="w-4 h-4 text-neon-gold" />
                    <span className="text-gray-400">College:</span>
                    <span className="text-white ml-auto truncate max-w-[140px]">{profile?.college_name || '—'}</span>
                  </div>
                </div>

                <Badge variant={profile?.role === 'admin' ? 'info' : 'secondary'} className="w-full justify-center mt-2">
                  {profile?.role === 'admin' ? 'Admin' : 'Team Account'}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registrations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Your Registrations</CardTitle>
                    <CardDescription className="text-gray-400">
                      {registrations.length} band{registrations.length !== 1 ? 's' : ''} registered
                    </CardDescription>
                  </div>
                  <Music className="w-5 h-5 text-neon-violet" />
                </div>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                      <Music className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-400">No registrations yet</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Register your band and compete for the ₹60,000 prize pool!
                      </p>
                    </div>
                    <Button variant="neon" asChild>
                      <Link to="/register" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Register Your Band
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div
                        key={reg.registration_id}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/20 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-white">{reg.team_name}</h3>
                            <p className="text-sm text-gray-400">{reg.college_name}</p>
                            <p className="text-xs text-gray-500">
                              Registered: {new Date(reg.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {reg.registration_status !== 'rejected' && reg.payment_status !== 'failed' && getStatusBadge(reg.registration_status)}
                            {reg.payment_status === 'failed' || reg.registration_status === 'rejected'
                              ? <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
                              : reg.payment_status && reg.payment_status !== 'pending' && getPaymentBadge(reg.payment_status)
                            }
                          </div>
                        </div>

                        <Separator className="my-3 bg-white/5" />

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span>Leader: {reg.team_leader_name}</span>
                          <span>Members: {Array.isArray(reg.team_members) ? reg.team_members.length : 0}</span>
                          <span>Mics: {reg.num_microphones}</span>
                          <span>Fee: ₹1,200</span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {reg.payment_status !== 'completed' && reg.payment_status !== 'failed' && reg.registration_status !== 'rejected' && (
                            <Button variant="neon-outline" size="sm" asChild>
                              <Link to={`/register?edit=${reg.registration_id}`} className="gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400"
                            onClick={() =>
                              setExpandedReg(
                                expandedReg === reg.registration_id ? null : reg.registration_id
                              )
                            }
                          >
                            {expandedReg === reg.registration_id ? (
                              <><EyeOff className="w-3 h-3 mr-1" /> Hide</>
                            ) : (
                              <><Eye className="w-3 h-3 mr-1" /> Details</>
                            )}
                          </Button>
                        </div>

                        {/* Expandable details section */}
                        {expandedReg === reg.registration_id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-white/5 space-y-3"
                          >
                            {/* Team Leader */}
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                <User className="w-3 h-3" /> Team Leader
                              </p>
                              <div className="pl-4 text-sm text-gray-300 space-y-0.5">
                                <p>{reg.team_leader_name}</p>
                                <p className="text-xs text-gray-500">{reg.team_leader_email}</p>
                                <p className="text-xs text-gray-500">{reg.team_leader_phone}</p>
                              </div>
                            </div>

                            {/* Team Members */}
                            {Array.isArray(reg.team_members) && reg.team_members.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                  <Users className="w-3 h-3" /> Team Members ({reg.team_members.length})
                                </p>
                                <div className="pl-4 space-y-1">
                                  {reg.team_members.map((member, j) => (
                                    <div key={j} className="text-sm text-gray-300 flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-medium">
                                        {j + 1}
                                      </span>
                                      <span>{member.name || member}</span>
                                      {member.role && (
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-white/10 text-gray-500">
                                          {member.role}
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Drum Setup */}
                            {reg.drum_setup && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                  <Music className="w-3 h-3" /> Drum Setup
                                </p>
                                <p className="pl-4 text-sm text-gray-300 capitalize">{reg.drum_setup}</p>
                              </div>
                            )}

                            {/* Additional Requirements */}
                            {reg.additional_requirements && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Additional Requirements
                                </p>
                                <p className="pl-4 text-sm text-gray-300">{reg.additional_requirements}</p>
                              </div>
                            )}

                            {/* Payment Info */}
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> Payment
                              </p>
                              <div className="pl-4 text-sm text-gray-300 space-y-0.5">
                                <p>Fee: ₹1,200</p>
                                {reg.transaction_id && (
                                  <p className="text-xs text-gray-500">Transaction: {reg.transaction_id}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
