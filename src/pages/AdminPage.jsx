import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle, Clock, AlertCircle, IndianRupee,
  ChevronDown, ChevronUp, Search, Filter, RefreshCw,
  Phone, Mail, Music, Drum, FileText, CreditCard, Trash2,
  Eye, ShieldCheck, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import api from '@/services/api';

export default function AdminPage() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [regsRes, statsRes] = await Promise.all([
        api.get('/registrations'),
        api.get('/registrations/stats/overview'),
      ]);
      setRegistrations(regsRes.data.data || []);
      setStats(statsRes.data.data || null);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerifyPayment = async (id) => {
    if (!window.confirm('Confirm payment as verified?')) return;
    setActionLoading(id);
    try {
      await api.patch(`/registrations/${id}/payment`, { payment_status: 'completed' });
      await fetchData();
    } catch (err) {
      console.error('Failed to verify payment:', err);
      alert('Failed to verify payment. ' + (err.response?.data?.message || ''));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectPayment = async (id) => {
    if (!window.confirm('Reject this payment? The registration will be marked as failed.')) return;
    setActionLoading(id);
    try {
      await api.patch(`/registrations/${id}/payment`, { payment_status: 'failed' });
      await fetchData();
    } catch (err) {
      console.error('Failed to reject payment:', err);
      alert('Failed to reject payment. ' + (err.response?.data?.message || ''));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, teamName) => {
    if (!window.confirm(`Delete registration for "${teamName}"? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      await api.delete(`/registrations/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete. ' + (err.response?.data?.message || ''));
    } finally {
      setActionLoading(null);
    }
  };

  // Filtering
  const filtered = registrations.filter((reg) => {
    const matchesSearch =
      !searchQuery ||
      reg.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.team_leader_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.college_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reg.registration_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || reg.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

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
      default:
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-violet-400" />
              Admin Panel
            </h1>
            <p className="text-gray-400 mt-1">Manage registrations & verify payments</p>
          </div>
          <Button variant="neon-outline" size="sm" onClick={fetchData} className="gap-2 self-start">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total Registrations"
              value={stats.total_registrations}
              color="violet"
            />
            <StatCard
              icon={<CheckCircle className="w-5 h-5" />}
              label="Confirmed"
              value={stats.confirmed}
              color="emerald"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Pending"
              value={stats.pending}
              color="amber"
            />
            <StatCard
              icon={<IndianRupee className="w-5 h-5" />}
              label="Revenue"
              value={`₹${stats.total_revenue?.toLocaleString() || 0}`}
              color="cyan"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search team, leader, college, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-gray-300 appearance-none cursor-pointer hover:border-violet-500/30 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="relative">
              <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-gray-300 appearance-none cursor-pointer hover:border-violet-500/30 transition-colors"
              >
                <option value="all">All Payment</option>
                <option value="pending">Unpaid</option>
                <option value="completed">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 mb-3">
          Showing {filtered.length} of {registrations.length} registrations
        </p>

        {/* Registrations List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No registrations found</p>
            </div>
          ) : (
            filtered.map((reg) => (
              <motion.div
                key={reg.registration_id}
                layout
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
              >
                {/* Main row */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Team info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-white text-lg">{reg.team_name}</h3>
                        {getStatusBadge(reg.registration_status)}
                        {getPaymentBadge(reg.payment_status)}
                      </div>
                      <p className="text-sm text-gray-400">{reg.college_name}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Leader: {reg.team_leader_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {reg.team_leader_phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {reg.team_leader_email}
                        </span>
                        <span>
                          Registered: {new Date(reg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Right: Transaction ID + Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                      {/* Transaction ID — prominently displayed */}
                      <div className="px-3 py-2 rounded-lg bg-slate-800/80 border border-white/5 min-w-[160px]">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Transaction ID</p>
                        <p className="text-sm font-mono text-cyan-300 font-medium">
                          {reg.transaction_id || <span className="text-gray-600 italic">Not provided</span>}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {reg.payment_status !== 'completed' && (
                          <Button
                            variant="neon"
                            size="sm"
                            onClick={() => handleVerifyPayment(reg.registration_id)}
                            disabled={actionLoading === reg.registration_id}
                            className="gap-1.5 text-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verify
                          </Button>
                        )}
                        {reg.payment_status !== 'failed' && reg.payment_status !== 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectPayment(reg.registration_id)}
                            disabled={actionLoading === reg.registration_id}
                            className="gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === reg.registration_id ? null : reg.registration_id)}
                          className="gap-1 text-xs text-gray-400"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {expandedId === reg.registration_id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(reg.registration_id, reg.team_name)}
                          disabled={actionLoading === reg.registration_id}
                          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 px-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedId === reg.registration_id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5">
                        <Separator className="mb-4 bg-white/5" />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Team Members */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                              <Music className="w-3.5 h-3.5" /> Team Members
                            </p>
                            <div className="space-y-1 pl-1">
                              {Array.isArray(reg.team_members) && reg.team_members.length > 0 ? (
                                reg.team_members.map((member, i) => (
                                  <p key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] flex items-center justify-center font-medium">
                                      {i + 1}
                                    </span>
                                    <span>{member.name}</span>
                                    {member.role && (
                                      <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                                        {member.role}
                                      </span>
                                    )}
                                  </p>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">No members listed</p>
                              )}
                            </div>
                          </div>

                          {/* Technical Requirements */}
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                <Music className="w-3.5 h-3.5" /> Microphones
                              </p>
                              <p className="text-sm text-gray-300 pl-1">{reg.num_microphones || 'Not specified'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                <Drum className="w-3.5 h-3.5" /> Drum Setup
                              </p>
                              <p className="text-sm text-gray-300 pl-1">{reg.drum_setup || 'Not required'}</p>
                            </div>
                            {reg.additional_requirements && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" /> Additional Requirements
                                </p>
                                <p className="text-sm text-gray-300 pl-1">{reg.additional_requirements}</p>
                              </div>
                            )}
                          </div>

                          {/* Payment Details */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5" /> Payment Info
                            </p>
                            <div className="pl-1 space-y-1 text-sm text-gray-300">
                              <p>Fee: ₹1,200</p>
                              <p>Status: {reg.payment_status}</p>
                              {reg.transaction_id && (
                                <p className="font-mono text-cyan-300">Txn: {reg.transaction_id}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[color]} border`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
