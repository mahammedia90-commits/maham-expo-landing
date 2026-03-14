'use client';

/**
 * TeamManagement — Manage exhibition team members
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Plus, Mail, Phone, Shield, Edit2, Trash2, UserPlus,
  Search, CheckCircle2, Clock, XCircle, Building2, Badge
} from "lucide-react";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "sales" | "support" | "logistics" | "designer";
  status: "active" | "pending" | "inactive";
  assignedExpos: string[];
  addedAt: string;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: "TM-001", name: "\u0623\u062D\u0645\u062F \u0627\u0644\u0634\u0645\u0631\u064A", email: "ahmed@company.sa", phone: "+966501234567", role: "sales", status: "active", assignedExpos: ["\u0645\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629"], addedAt: "2026-02-15" },
  { id: "TM-002", name: "\u0633\u0627\u0631\u0629 \u0627\u0644\u0645\u0627\u0644\u0643\u064A", email: "sara@company.sa", phone: "+966509876543", role: "support", status: "active", assignedExpos: ["\u0645\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629", "\u0645\u0639\u0631\u0636 \u0627\u0644\u062A\u0642\u0646\u064A\u0629"], addedAt: "2026-02-20" },
  { id: "TM-003", name: "\u062E\u0627\u0644\u062F \u0627\u0644\u0639\u062A\u064A\u0628\u064A", email: "khaled@company.sa", phone: "+966505551234", role: "logistics", status: "pending", assignedExpos: [], addedAt: "2026-03-01" },
];

export default function TeamManagement() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", role: "sales" as TeamMember["role"] });

  const roleLabels: Record<string, string> = {
    manager: isAr ? "\u0645\u062F\u064A\u0631" : "Manager",
    sales: isAr ? "\u0645\u0628\u064A\u0639\u0627\u062A" : "Sales",
    support: isAr ? "\u062F\u0639\u0645" : "Support",
    logistics: isAr ? "\u0644\u0648\u062C\u0633\u062A\u064A\u0627\u062A" : "Logistics",
    designer: isAr ? "\u0645\u0635\u0645\u0645" : "Designer",
  };

  const statusLabels: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    active: { label: isAr ? "\u0646\u0634\u0637" : "Active", color: "text-green-400", icon: CheckCircle2 },
    pending: { label: isAr ? "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062A\u0623\u0643\u064A\u062F" : "Pending", color: "text-yellow-400", icon: Clock },
    inactive: { label: isAr ? "\u063A\u064A\u0631 \u0646\u0634\u0637" : "Inactive", color: "text-red-400", icon: XCircle },
  };

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast.error(isAr ? "\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629" : "Please fill all required fields");
      return;
    }
    const member: TeamMember = {
      id: `TM-${String(team.length + 1).padStart(3, "0")}`,
      ...newMember,
      status: "pending",
      assignedExpos: [],
      addedAt: new Date().toISOString().split("T")[0],
    };
    setTeam(prev => [...prev, member]);
    setNewMember({ name: "", email: "", phone: "", role: "sales" });
    setShowAddForm(false);
    toast.success(isAr ? "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0639\u0636\u0648 \u0627\u0644\u0641\u0631\u064A\u0642 \u0628\u0646\u062C\u0627\u062D" : "Team member added successfully");
  };

  const handleRemoveMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    toast.success(isAr ? "\u062A\u0645 \u062D\u0630\u0641 \u0639\u0636\u0648 \u0627\u0644\u0641\u0631\u064A\u0642" : "Team member removed");
  };

  const handleToggleStatus = (id: string) => {
    setTeam(prev => prev.map(m => {
      if (m.id !== id) return m;
      const newStatus = m.status === "active" ? "inactive" : "active";
      return { ...m, status: newStatus };
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gold-gradient flex items-center gap-2" style={{ fontFamily: "'IBM Plex Sans Arabic', serif" }}>
            <Users size={22} className="t-gold" />
            {isAr ? "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0641\u0631\u064A\u0642" : "Team Management"}
          </h1>
          <p className="text-xs t-tertiary mt-1">
            {isAr ? "\u0623\u0636\u0641 \u0623\u0639\u0636\u0627\u0621 \u0641\u0631\u064A\u0642\u0643 \u0648\u0639\u064A\u0651\u0646 \u0623\u062F\u0648\u0627\u0631\u0647\u0645 \u0641\u064A \u0627\u0644\u0645\u0639\u0627\u0631\u0636" : "Add team members and assign their roles in exhibitions"}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
        >
          <UserPlus size={14} />
          {isAr ? "\u0625\u0636\u0627\u0641\u0629 \u0639\u0636\u0648" : "Add Member"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0641\u0631\u064A\u0642" : "Total Team", value: team.length, icon: Users },
          { label: isAr ? "\u0646\u0634\u0637" : "Active", value: team.filter(m => m.status === "active").length, icon: CheckCircle2 },
          { label: isAr ? "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062A\u0623\u0643\u064A\u062F" : "Pending", value: team.filter(m => m.status === "pending").length, icon: Clock },
          { label: isAr ? "\u0627\u0644\u0623\u062F\u0648\u0627\u0631" : "Roles", value: new Set(team.map(m => m.role)).size, icon: Badge },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={12} className="t-gold" />
              <span className="text-[12px] t-tertiary">{s.label}</span>
            </div>
            <p className="text-lg font-bold t-primary font-['Inter']">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5"
          style={{ border: "1px solid rgba(197,165,90,0.15)" }}
        >
          <h3 className="text-sm font-bold t-secondary mb-4 flex items-center gap-2">
            <UserPlus size={14} className="t-gold" />
            {isAr ? "\u0625\u0636\u0627\u0641\u0629 \u0639\u0636\u0648 \u062C\u062F\u064A\u062F" : "Add New Member"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[12px] t-tertiary mb-1 block">{isAr ? "\u0627\u0644\u0627\u0633\u0645 *" : "Name *"}</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                className="w-full glass-card rounded-lg px-3 py-2 text-xs t-secondary"
                placeholder={isAr ? "\u0627\u0633\u0645 \u0627\u0644\u0639\u0636\u0648" : "Member name"}
              />
            </div>
            <div>
              <label className="text-[12px] t-tertiary mb-1 block">{isAr ? "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A *" : "Email *"}</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                className="w-full glass-card rounded-lg px-3 py-2 text-xs t-secondary"
                placeholder="email@company.sa"
              />
            </div>
            <div>
              <label className="text-[12px] t-tertiary mb-1 block">{isAr ? "\u0627\u0644\u0647\u0627\u062A\u0641" : "Phone"}</label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full glass-card rounded-lg px-3 py-2 text-xs t-secondary"
                placeholder="+966..."
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-[12px] t-tertiary mb-1 block">{isAr ? "\u0627\u0644\u062F\u0648\u0631" : "Role"}</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as TeamMember["role"] }))}
                className="w-full glass-card rounded-lg px-3 py-2 text-xs t-secondary"
              >
                {Object.entries(roleLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddMember} className="btn-gold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
              <Plus size={12} />
              {isAr ? "\u0625\u0636\u0627\u0641\u0629" : "Add"}
            </button>
            <button onClick={() => setShowAddForm(false)} className="glass-card px-4 py-2 rounded-lg text-xs t-tertiary">
              {isAr ? "\u0625\u0644\u063A\u0627\u0621" : "Cancel"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 t-muted" style={{ [isRtl ? "right" : "left"]: "12px" }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass-card rounded-xl py-2.5 text-xs t-secondary"
          style={{ [isRtl ? "paddingRight" : "paddingLeft"]: "36px", [isRtl ? "paddingLeft" : "paddingRight"]: "12px" }}
          placeholder={isAr ? "\u0627\u0628\u062D\u062B \u0639\u0646 \u0639\u0636\u0648..." : "Search member..."}
        />
      </div>

      {/* Team List */}
      <div className="space-y-3">
        {filteredTeam.map((member, i) => {
          const statusInfo = statusLabels[member.status];
          const StatusIcon = statusInfo.icon;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold t-gold">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold t-primary">{member.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[12px] px-2 py-0.5 rounded-full bg-gold-subtle t-gold">{roleLabels[member.role]}</span>
                      <span className={`text-[12px] flex items-center gap-1 ${statusInfo.color}`}>
                        <StatusIcon size={10} />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[11px] t-tertiary flex items-center gap-1">
                        <Mail size={9} /> {member.email}
                      </span>
                      {member.phone && (
                        <span className="text-[11px] t-tertiary flex items-center gap-1 font-['Inter']">
                          <Phone size={9} /> {member.phone}
                        </span>
                      )}
                    </div>
                    {member.assignedExpos.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {member.assignedExpos.map((expo, j) => (
                          <span key={j} className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--glass-bg)] t-tertiary flex items-center gap-1">
                            <Building2 size={8} /> {expo}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                    title={isAr ? "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u062D\u0627\u0644\u0629" : "Toggle status"}
                  >
                    <Shield size={12} className="t-tertiary" />
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                    title={isAr ? "\u062D\u0630\u0641" : "Remove"}
                  >
                    <Trash2 size={12} className="text-red-400/60" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTeam.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Users size={32} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-tertiary">{isAr ? "\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u0639\u0636\u0627\u0621 \u0641\u064A \u0627\u0644\u0641\u0631\u064A\u0642" : "No team members found"}</p>
        </div>
      )}
    </div>
  );
}
