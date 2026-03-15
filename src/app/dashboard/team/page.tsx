'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Users, Mail, Eye, Settings, CreditCard,
  FileText, Shield, Trash2, CheckCircle2, Building2
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const roles = [
  { value: 'admin', labelAr: 'مدير', labelEn: 'Admin', color: '#C5A55A' },
  { value: 'manager', labelAr: 'مشرف', labelEn: 'Manager', color: '#38BDF8' },
  { value: 'viewer', labelAr: 'مشاهد', labelEn: 'Viewer', color: '#4ADE80' },
  { value: 'sales', labelAr: 'مبيعات', labelEn: 'Sales', color: '#A78BFA' },
];

const permissionDefs = [
  { key: 'view_bookings', labelAr: 'عرض الحجوزات', labelEn: 'View Bookings', icon: Eye },
  { key: 'manage_bookings', labelAr: 'إدارة الحجوزات', labelEn: 'Manage Bookings', icon: Building2 },
  { key: 'view_contracts', labelAr: 'عرض العقود', labelEn: 'View Contracts', icon: FileText },
  { key: 'manage_payments', labelAr: 'إدارة المدفوعات', labelEn: 'Manage Payments', icon: CreditCard },
  { key: 'manage_team', labelAr: 'إدارة الفريق', labelEn: 'Manage Team', icon: Users },
  { key: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
];

export default function TeamPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const [showForm, setShowForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['view_bookings']);

  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: isAr ? 'أحمد محمد' : 'Ahmed Mohammed', email: 'ahmed@company.sa', role: isAr ? 'مدير' : 'Admin', permissions: ['view_bookings', 'manage_bookings', 'view_contracts', 'manage_payments', 'manage_team', 'settings'] },
    { id: '2', name: isAr ? 'سارة العلي' : 'Sara Al-Ali', email: 'sara@company.sa', role: isAr ? 'مشرف' : 'Manager', permissions: ['view_bookings', 'manage_bookings', 'view_contracts'] },
    { id: '3', name: isAr ? 'خالد الراشد' : 'Khalid Al-Rashid', email: 'khalid@company.sa', role: isAr ? 'مبيعات' : 'Sales', permissions: ['view_bookings'] },
  ]);

  const togglePerm = (key: string) => {
    setSelectedPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const addMember = () => {
    if (!memberName || !memberEmail) {
      toast.error(isAr ? 'يرجى إكمال الاسم والبريد الإلكتروني' : 'Please fill name and email');
      return;
    }
    const role = roles.find(r => r.value === selectedRole);
    setMembers(prev => [...prev, {
      id: String(Date.now()),
      name: memberName,
      email: memberEmail,
      role: isAr ? role?.labelAr || selectedRole : role?.labelEn || selectedRole,
      permissions: selectedPerms,
    }]);
    toast.success(isAr ? 'تمت إضافة العضو وإرسال الدعوة' : 'Member added and invitation sent');
    setMemberName(''); setMemberEmail(''); setSelectedRole('viewer'); setSelectedPerms(['view_bookings']); setShowForm(false);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success(isAr ? 'تم حذف العضو' : 'Member removed');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
            {isAr ? 'إدارة الفريق' : 'Team Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? `${members.length} عضو في الفريق` : `${members.length} team members`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          {isAr ? 'إضافة عضو' : 'Add Member'}
        </button>
      </div>

      {/* Add Member Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-5 rounded-xl bg-card border border-[#C5A55A]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C5A55A]" />
                  {isAr ? 'إضافة عضو جديد' : 'Add New Member'}
                </h3>
                <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder={isAr ? 'اسم العضو' : 'Member Name'} value={memberName} onChange={e => setMemberName(e.target.value)} className="px-4 py-2.5 rounded-lg bg-accent/30 border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50" />
                <input placeholder={isAr ? 'البريد الإلكتروني' : 'Email'} type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} className="px-4 py-2.5 rounded-lg bg-accent/30 border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">{isAr ? 'الدور' : 'Role'}</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map(r => (
                    <button key={r.value} onClick={() => setSelectedRole(r.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${selectedRole === r.value ? 'border-[#C5A55A]/50 bg-[#C5A55A]/10 text-[#C5A55A] font-medium' : 'border-border/50 text-muted-foreground hover:bg-accent/50'}`}>
                      {isAr ? r.labelAr : r.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">{isAr ? 'الصلاحيات' : 'Permissions'}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {permissionDefs.map(p => (
                    <button key={p.key} onClick={() => togglePerm(p.key)}
                      className={`p-2.5 rounded-lg text-xs border transition-all flex items-center gap-2 ${selectedPerms.includes(p.key) ? 'border-green-500/30 bg-green-500/5 text-green-400' : 'border-border/50 text-muted-foreground hover:bg-accent/50'}`}>
                      {selectedPerms.includes(p.key) ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <p.icon className="w-3.5 h-3.5" />}
                      {isAr ? p.labelAr : p.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={addMember} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] font-semibold text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  {isAr ? 'إضافة ودعوة' : 'Add & Invite'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border/50 text-sm hover:bg-accent/50">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">{isAr ? 'لم تتم إضافة أعضاء بعد' : 'No team members yet'}</p>
          <p className="text-xs text-muted-foreground mt-1">{isAr ? 'أضف أعضاء فريقك لتمكينهم من إدارة الحجوزات والعقود' : 'Add team members to enable them to manage bookings and contracts'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, idx) => {
            const roleObj = roles.find(r => r.labelAr === member.role || r.labelEn === member.role) || roles[2];
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border/50 hover:border-border/80 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center text-[#0A0A12] font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />{member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] border-0 px-2 py-0.5 rounded-full flex items-center gap-0.5" style={{ backgroundColor: `${roleObj.color}15`, color: roleObj.color }}>
                      <Shield className="w-3 h-3" />
                      {member.role}
                    </span>
                    <button onClick={() => removeMember(member.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
                {member.permissions && member.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/30">
                    {member.permissions.map(perm => {
                      const def = permissionDefs.find(d => d.key === perm);
                      return def ? (
                        <span key={perm} className="px-2 py-0.5 rounded-md text-[10px] bg-accent/50 text-muted-foreground">
                          {isAr ? def.labelAr : def.labelEn}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
