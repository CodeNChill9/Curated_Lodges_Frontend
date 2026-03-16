"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  KeyRound, Plus, Trash2, Copy, CheckCheck,
  RefreshCw, Mail, Calendar, Link2, ShieldCheck,
  Clock, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import styles from "./page.module.css";
import { AdminContext } from "../layout";

function fmt(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export default function AdminInvitesPage() {
  const { adminKey } = useContext(AdminContext);

  const [invites, setInvites]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [loadError, setLoadError]     = useState("");

  const [label, setLabel]             = useState("");
  const [email, setEmail]             = useState("");
  const [expiresInDays, setExpires]   = useState("");
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState("");
  const [newInvite, setNewInvite]     = useState(null);
  const [copiedId, setCopiedId]       = useState(null);

  const [formOpen, setFormOpen]       = useState(true);

  const loadInvites = useCallback(async (key) => {
    setLoading(true);
    setLoadError("");
    try {
      const res  = await fetch("/api/invite", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setInvites(data.invites || []);
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      loadInvites(adminKey);
    }
  }, [adminKey, loadInvites]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setNewInvite(null);
    try {
      const body = { label, email };
      if (expiresInDays) body.expiresInDays = Number(expiresInDays);
      const res  = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invite");

      setNewInvite(data);
      setLabel("");
      setEmail("");
      setExpires("");
      await loadInvites(adminKey);
    } catch (e) {
      setCreateError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (token) => {
    if (!confirm("Delete this invite? Any form using this URL will fail.")) return;
    try {
      const res = await fetch(`/api/invite?token=${encodeURIComponent(token)}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete");
      }
      await loadInvites(adminKey);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const copyToClipboard = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      alert("Failed to copy");
    }
  };

  const pendingArr = invites.filter(i => !i.used && !isExpired(i.expiresAt));
  const usedArr = invites.filter(i => i.used);
  const expiredArr = invites.filter(i => !i.used && isExpired(i.expiresAt));

  return (
    <main className={styles.main}>
      <div className={styles.mainTop}>
        <h2 className={styles.pageTitle}>Invite Management</h2>
        <p className={styles.pageSub}>Generate and manage lodge registration invite links.</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{pendingArr.length}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{usedArr.length}</span>
          <span className={styles.statLabel}>Used</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{expiredArr.length}</span>
          <span className={styles.statLabel}>Expired</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{invites.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      <section className={styles.section}>
        <div 
          className={styles.sectionToggle}
          onClick={() => setFormOpen(!formOpen)}
        >
          <span className={styles.sectionTitleRow}>
            <Plus size={18} color="#F1663F" />
            <h2 className={styles.sectionTitle}>Generate New Invite URL</h2>
          </span>
          {formOpen ? <ChevronUp size={20} color="#8D9994" /> : <ChevronDown size={20} color="#8D9994" />}
        </div>
        
        {formOpen && (
          <div className={styles.sectionBody}>
            <form onSubmit={handleCreate} className={styles.createForm}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>
                    Label <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Vanya Villas"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>
                    Lodge Email <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lodge@example.com"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>
                    Expires in <span className={styles.optional}>(days)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={expiresInDays}
                    onChange={(e) => setExpires(e.target.value)}
                    placeholder="e.g. 7"
                    className={styles.formInput}
                  />
                </div>
              </div>
              {createError && <p className={styles.formError}>{createError}</p>}
              <button type="submit" className={styles.createBtn} disabled={creating}>
                {creating ? "Generating..." : "Generate Invite Link"}
              </button>
            </form>

            {newInvite && (
              <div className={styles.newInviteBanner}>
                <div className={styles.bannerTitle}>
                  <AlertCircle size={16} /> Invite Created - copy & send this URL
                </div>
                <div className={styles.inviteUrlRow}>
                  <span className={styles.inviteUrlText}>{newInvite.inviteUrl}</span>
                  <button
                    className={`${styles.copyBtn} ${copiedId === "new" ? styles.copyBtnDone : ""}`}
                    onClick={() => copyToClipboard("new", newInvite.inviteUrl)}
                  >
                    {copiedId === "new" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                {newInvite.expiresAt && (
                  <p className={styles.bannerExpiry}>
                    <Clock size={12} /> Expires: {fmt(newInvite.expiresAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.tableHeader}>
          <div className={styles.sectionTitleRow} style={{ padding: "0" }}>
            <Link2 size={18} color="#F1663F" />
            <h2 className={styles.sectionTitle}>Existing Invites</h2>
          </div>
          <button onClick={() => loadInvites(adminKey)} className={styles.refreshBtn} disabled={loading}>
            <RefreshCw size={14} className={loading ? styles.spin : ""} /> Refresh
          </button>
        </div>

        {loadError && <p className={styles.formError}>{loadError}</p>}

        {!loading && invites.length === 0 && (
          <div className={styles.emptyMsg}>No invites generated yet.</div>
        )}

        {invites.length > 0 && (
          <div className={styles.inviteTable}>
            <div className={styles.tableHeaderSub}>
              <span>Label / Email</span>
              <span>Created</span>
              <span>Expires</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            
            {invites.map(inv => {
              const expired = isExpired(inv.expiresAt);
              let statusLabel = "Active";
              let pillClass = styles.pill_pending;
              if (inv.used) {
                statusLabel = "Used";
                pillClass = styles.pill_used;
              } else if (expired) {
                statusLabel = "Expired";
                pillClass = styles.pill_expired;
              }

              return (
                <div key={inv._id} className={`${styles.tableRow} ${inv.used ? styles.row_used : ""} ${expired && !inv.used ? styles.row_expired : ""}`}>
                  <div className={styles.cellLabelEmail}>
                    <span className={styles.rowLabel}>{inv.label || <em>No label</em>}</span>
                    {inv.email && (
                      <span className={styles.rowEmail}>
                        <Mail size={12} /> {inv.email}
                      </span>
                    )}
                  </div>
                  <div className={styles.cell}>{fmt(inv.createdAt)}</div>
                  <div className={styles.cell}>
                    {inv.expiresAt ? fmt(inv.expiresAt) : <span className={styles.noExpiry}>Never</span>}
                  </div>
                  <div className={styles.cell}>
                    <span className={`${styles.statusPill} ${pillClass}`}>{statusLabel}</span>
                    {inv.used && inv.usedAt && (
                      <span className={styles.usedAt}>Used {fmt(inv.usedAt)}</span>
                    )}
                  </div>
                  <div className={styles.cellActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.actionCopy}`}
                      onClick={() => copyToClipboard(inv._id, inv.inviteUrl || `${window.location.origin}/register-lodge?invite=${inv.token}`)}
                      title="Copy URL"
                    >
                      {copiedId === inv._id ? <CheckCheck size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionDelete}`}
                      onClick={() => handleDelete(inv.token)}
                      title="Delete Invite"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

