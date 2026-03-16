"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { 
  Building2, Users, FileText, ChevronDown, ChevronUp, MapPin, Search, Calendar, Image as ImageIcon 
} from "lucide-react";
import styles from "./page.module.css";
import { AdminContext } from "../layout";

export default function AdminApplicationsPage() {
  const { adminKey } = useContext(AdminContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchApplications = useCallback(async (keyToUse) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        headers: { "x-admin-key": keyToUse },
      });
      if (res.status === 401) {
        throw new Error("Invalid admin key.");
      }
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      fetchApplications(adminKey);
    }
  }, [adminKey, fetchApplications]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className={styles.main}>
      <div className={styles.mainTop}>
        <h2 className={styles.pageTitle}>Submitted Lodge Applications</h2>
        <p className={styles.pageSub}>Review registration details from partners.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderLeft}>
            <h3 className={styles.tableTitle}>Applications ({applications.length})</h3>
          </div>
          <button onClick={() => fetchApplications(adminKey)} className={styles.refreshBtn}>
            Refresh Data
          </button>
        </div>

        {loading && !applications.length ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <Building2 size={32} strokeWidth={1.5} color="#D4D4D4" />
            </div>
            <h3 className={styles.emptyTitle}>No Applications Yet</h3>
            <p className={styles.emptySub}>When a lodge owner submits a form, it will appear here.</p>
          </div>
        ) : (
          <div className={styles.listWrap}>
            {applications.map((app) => (
              <div key={app._id} className={`${styles.listItem} ${expandedId === app._id ? styles.expanded : ""}`}>
                <div className={styles.listRow} onClick={() => toggleExpand(app._id)}>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitleWrap}>
                      <h4 className={styles.rowTitle}>{app.resortName || "Unknown Resort"}</h4>
                      {app.status === 'pending' && <span className={styles.statusBadge}>New</span>}
                    </div>
                    <div className={styles.rowMeta}>
                      <span className={styles.metaItem}><Users size={14} /> {app.fullName}</span>
                      <span className={styles.metaItem}><MapPin size={14} /> {app.resortCategory || "Uncategorized"}</span>
                      <span className={styles.metaItem}><Calendar size={14} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles.rowAction}>
                    {expandedId === app._id ? <ChevronUp size={20} color="#737373" /> : <ChevronDown size={20} color="#737373" />}
                  </div>
                </div>

                {expandedId === app._id && (
                  <div className={styles.listDetails}>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailsSection}>
                        <h5 className={styles.sectionHeading}>Contact & Property Basics</h5>
                        <div className={styles.detailItem}><strong>Email:</strong> <span>{app.email}</span></div>
                        <div className={styles.detailItem}><strong>Website:</strong> {app.website ? <a href={app.website} target="_blank" rel="noreferrer" className={styles.detailLink}>{app.website}</a> : <span>N/A</span>}</div>
                        <div className={styles.detailItem}><strong>Main Contact Details:</strong> <pre className={styles.detailPre}>{app.mainContact}</pre></div>
                      </div>

                      <div className={styles.detailsSection}>
                        <h5 className={styles.sectionHeading}>Location & Accommodation</h5>
                        <div className={styles.detailItem}><strong>Address:</strong> <pre className={styles.detailPre}>{app.address}</pre></div>
                        <div className={styles.detailItem}><strong>Maps Link:</strong> {app.mapsLink ? <a href={app.mapsLink} target="_blank" rel="noreferrer" className={styles.detailLink}>View on Google Maps</a> : <span>N/A</span>}</div>
                        <div className={styles.detailItem}><strong>Number of Rooms:</strong> <span>{app.numberOfRooms}</span></div>
                        <div className={styles.detailItem}><strong>Room Types:</strong> <pre className={styles.detailPre}>{app.roomTypes}</pre></div>
                        <div className={styles.detailItem}><strong>Meal Plans:</strong> <span>{app.mealPlans?.length ? app.mealPlans.join(', ') : 'N/A'}</span></div>
                      </div>

                      <div className={styles.detailsSection}>
                        <h5 className={styles.sectionHeading}>Ethos & Experience</h5>
                        <div className={styles.detailItem}><strong>Origin Story:</strong> <pre className={styles.detailPre}>{app.originStory}</pre></div>
                        <div className={styles.detailItem}><strong>Nature Blend:</strong> <pre className={styles.detailPre}>{app.natureBlend}</pre></div>
                        <div className={styles.detailItem}><strong>Naturalist Philosophy:</strong> <pre className={styles.detailPre}>{app.naturalistPhilosophy}</pre></div>
                        <div className={styles.detailItem}><strong>After-Safari Vibe:</strong> <pre className={styles.detailPre}>{app.afterSafariVibe}</pre></div>
                        <div className={styles.detailItem}><strong>Conservation & Footprint:</strong> <pre className={styles.detailPre}>{app.conservation}</pre></div>
                        <div className={styles.detailItem}><strong>Unique Selling Points:</strong> <pre className={styles.detailPre}>{app.uniquePoints}</pre></div>
                      </div>

                      <div className={styles.detailsSection}>
                        <h5 className={styles.sectionHeading}>Media & B2B Commercials</h5>
                        <div className={styles.detailItem}><strong>Payment Method:</strong> <pre className={styles.detailPre}>{app.paymentMethod}</pre></div>
                        {app.cancelPolicyText && <div className={styles.detailItem}><strong>Cancellation Policy (Text):</strong> <pre className={styles.detailPre}>{app.cancelPolicyText}</pre></div>}
                        
                        <div className={styles.linkGroup}>
                          {app.mediaLink && (
                            <a href={app.mediaLink} target="_blank" rel="noreferrer" className={styles.docBtn}>
                              <ImageIcon size={16} /> Media Folder Link
                            </a>
                          )}
                          {app.factSheetDriveLink && (
                            <a href={app.factSheetDriveLink} target="_blank" rel="noreferrer" className={styles.docBtn}>
                              <FileText size={16} /> View Fact Sheet ({app.factSheetFileName})
                            </a>
                          )}
                          {app.cancelPolicyDriveLink && (
                            <a href={app.cancelPolicyDriveLink} target="_blank" rel="noreferrer" className={styles.docBtn}>
                              <FileText size={16} /> View Cancel Policy ({app.cancelPolicyFileName})
                            </a>
                          )}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
