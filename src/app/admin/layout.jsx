"use client";
import React, { useState, useEffect, createContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut } from "lucide-react";
import styles from "./layout.module.css";

export const AdminContext = createContext(null);

export default function AdminLayout({ children }) {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  
  const pathname = usePathname();

  const verifyKey = async (key) => {
    setLoading(true);
    setAuthError("");
    try {
      // You can hit any auth-protected endpoint to verify 
      const res = await fetch("/api/invite", { headers: { "x-admin-key": key } });
      if (res.ok) {
        setAdminKey(key);
        setIsAuth(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("jungloreAdminKey", key);
        }
      } else {
        setIsAuth(false);
        setAdminKey("");
        setAuthError("Invalid Password.");
        if (typeof window !== "undefined") localStorage.removeItem("jungloreAdminKey");
      }
    } catch (e) {
      setAuthError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("jungloreAdminKey") : null;
    if (stored) {
      verifyKey(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      verifyKey(inputKey.trim());
    }
  };

  const handleLogout = () => {
    setAdminKey("");
    setIsAuth(false);
    setInputKey("");
    if (typeof window !== "undefined") localStorage.removeItem("jungloreAdminKey");
  };

  if (loading) {
    return <div className={styles.loadingScreen}><div className={styles.spinner}></div></div>;
  }

  if (!isAuth) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginIconRing}><Lock size={32} color="#F1663F" strokeWidth={1.5} /></div>
          <h1 className={styles.loginTitle}>Cuarted Lodges Admin</h1>
          <p className={styles.loginSub}>Enter your admin password to access the dashboard.</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className={styles.loginInput}
              autoFocus
            />
            {authError && <div className={styles.loginError}>{authError}</div>}
            <button type="submit" disabled={loading} className={styles.loginBtn}>
              {loading ? "Verifying..." : "Authenticate"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ adminKey }}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.headerBrand}>
              <span className={styles.headerLogo}>Curated Lodges</span>
              <span className={styles.headerSep}>/</span>
              <span className={styles.headerTitle}>Admin</span>
              
              <div className={styles.navLinks}>
                <Link 
                  href="/admin/invites" 
                  className={`${styles.navLink} ${pathname === '/admin/invites' ? styles.active : ''}`}
                >
                  Invites
                </Link>
                <Link 
                  href="/admin/applications" 
                  className={`${styles.navLink} ${pathname === '/admin/applications' ? styles.active : ''}`}
                >
                  Applications
                </Link>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </header>

        <div className={styles.coreContent}>
          {children}
        </div>
      </div>
    </AdminContext.Provider>
  );
}
