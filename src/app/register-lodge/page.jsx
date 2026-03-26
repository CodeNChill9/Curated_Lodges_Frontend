"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Layout/Footer";
import {
  Trees, Mail, User, Building2, Globe, MapPinned, BedDouble,
  Utensils, BookOpen, Compass, Sunset, Heart, Sparkles,
  FileText, CreditCard, FileX2, ScrollText,
  CheckCircle2, ArrowLeft, ArrowRight, Send,
  Info, UploadCloud, Image as ImageIcon, Lock,
} from "lucide-react";
import styles from "./page.module.css";

const TERMS_CONTENT = `
PARTNER SERVICES AGREEMENT

By listing a property on Curated Lodges, you (the "Partner") enter
into a legally binding agreement with CloudsAvenue TechSolutions LLP (the "Company").
This agreement governs your use of the Junglore powered platform.

1. Grant of Admin Access & Security
Upon successful registration, the Partner will be granted access to an administrative
dashboard ("Admin Panel") to manage property pricing, inventory, descriptions, and booking
details.

• Authorized Personnel Only: Access to the Admin Panel must be restricted to
authorized employees or representatives of the Partner.

• Duty of Caution: The Partner acknowledges that the Admin Panel controls live
pricing and availability. All updates must be handled with strict caution. The
Company is not responsible for losses resulting from "fat-finger" errors, accidental
price drops, or incorrect inventory updates made by the Partner.

• Credential Security: The Partner is solely responsible for maintaining the
confidentiality of login credentials. Any action taken via the Partner's admin account
is deemed to be authorized by the Partner.

2. Content, Media & Intellectual Property
By uploading photographs, videos, and property descriptions, the Partner affirms:

• Clear Title: The Partner owns the content or holds valid licenses for all uploaded
media.

• IP Indemnity: The media is free from any intellectual property legal encumbrances.
The Partner shall defend and indemnify CloudsAvenue TechSolutions LLP against
any copyright infringement claims.

• Usage Rights: The Partner grants the Platform a non-exclusive, worldwide, royalty-
free license to use these materials for display on Curated Lodges and for broader
marketing/social media promotion.

3. Accuracy of Information
The Partner must ensure that all property details (amenities, location, house rules) are
accurate. If a guest books a stay based on inaccurate information provided in the Admin
Panel, the Partner is liable to provide the service as described or compensate the
guest/Platform for the discrepancy.

4. Limitation of Liability


• Platform Availability: While we strive for 99.9% uptime, the Company is not liable
for any temporary downtime of the Junglore-powered dashboard.

• Financial Loss: CloudsAvenue TechSolutions LLP is not liable for indirect,
incidental, or consequential damages. Our total liability is limited to the commission
earned by the Platform from the Partner's listings in the 90 days prior to a claim.

5. Legal Disputes & Jurisdiction
This agreement is governed by the laws of India. Any disputes arising from the use of the
Platform or these terms shall be settled exclusively in the courts of Mumbai, India.

6. Digital Acceptance
The Partner acknowledges that by clicking the "Accept" or "Sign Up" button, they are
providing a digital signature that carries the same weight as a physical signature under the
Information Technology Act, 2000.
`;

const SIDE_DATA = [
  {
    img: "/assests/images/1.png",
    title: "Begin the Journey",
    desc: "Introduce us to the faces behind the sanctuary. Every great partnership starts with a simple hello.",
  },
  {
    img: "/assests/images/2.png",
    title: "Where the Wild Is",
    desc: "Map your footprint. Help us understand the geography and scale of your haven in the wilderness.",
  },
  {
    img: "/assests/images/3.png",
    title: "The Junglore Soul",
    desc: "This is the heart of your application. Tell us the story, the ethics, and the magic of your wildlife experience.",
  },
  {
    img: "/assests/images/4.png",
    title: "The Inner Circle",
    desc: "Share your perspective, provide the visuals, and finalise your partnership agreement.",
  },
];

const RegisterLodgePage = () => {
  // ── Invite gate ────────────────────────────────────────────────────────────
  const [inviteStatus, setInviteStatus] = useState("checking");
  const [inviteToken, setInviteToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("invite");
    if (!token) {
      setInviteStatus("missing");
      return;
    }
    setInviteToken(token);
    fetch(`/api/invite?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => setInviteStatus(data.valid ? "valid" : (data.reason || "invalid")))
      .catch(() => setInviteStatus("invalid"));
  }, []);

  const STORAGE_KEY = "registerLodgeFormData";

  const [submitted, setSubmitted] = useState(false);
  const [tncAccepted, setTncAccepted] = useState(false);
  const [otherCategory, setOtherCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mealPlans, setMealPlans] = useState([]);
  const [factSheetFile, setFactSheetFile] = useState(null);
  const [cancelPolicyFile, setCancelPolicyFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAutosaved, setShowAutosaved] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const [showRestoredToast, setShowRestoredToast] = useState(false);

  const [formFields, setFormFields] = useState({
    email: "", fullName: "", resortName: "", website: "", mainContact: "",
    address: "", mapsLink: "", numberOfRooms: "", roomTypes: "",
    originStory: "", natureBlend: "", naturalistPhilosophy: "",
    afterSafariVibe: "", conservation: "", uniquePoints: "",
    mediaLink: "", paymentMethod: "", cancelPolicyText: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Load saved form data on mount ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formFields) {
          // Ensure numberOfRooms is a string for the input value
          if (parsed.formFields.numberOfRooms) {
            parsed.formFields.numberOfRooms = String(parsed.formFields.numberOfRooms);
          }
          setFormFields(parsed.formFields);
        }
        if (parsed.currentStep !== undefined) setCurrentStep(parsed.currentStep);
        if (parsed.selectedCategory) setSelectedCategory(parsed.selectedCategory);
        if (parsed.otherCategory) setOtherCategory(parsed.otherCategory);
        if (parsed.mealPlans && Array.isArray(parsed.mealPlans)) setMealPlans(parsed.mealPlans);
        if (parsed.tncAccepted) setTncAccepted(parsed.tncAccepted);
        setHasRestoredData(true);

        // Show toast notification
        setTimeout(() => {
          setShowRestoredToast(true);
          // Auto-hide toast after 4 seconds
          setTimeout(() => setShowRestoredToast(false), 4000);
        }, 800);
      }
    } catch (err) {
      console.warn("Failed to load saved form data:", err);
      // If corrupted, clear the storage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (clearErr) {
        // Silent fail
      }
    } finally {
      // Mark initial load as complete
      setTimeout(() => setIsInitialLoad(false), 500);
    }
  }, []);

  // ── Save form data to localStorage whenever it changes ─────────────────
  useEffect(() => {
    if (typeof window === "undefined" || inviteStatus !== "valid" || isInitialLoad) return;
    try {
      const dataToSave = {
        formFields,
        currentStep,
        selectedCategory,
        otherCategory,
        mealPlans,
        tncAccepted,
        savedAt: new Date().toISOString(),
      };
      const jsonString = JSON.stringify(dataToSave);

      // Check if data size is reasonable (< 4MB to be safe with 5MB limit)
      if (jsonString.length > 4 * 1024 * 1024) {
        console.warn("Form data too large for localStorage");
        return;
      }

      localStorage.setItem(STORAGE_KEY, jsonString);

      // Show autosave indicator briefly
      setShowAutosaved(true);
      const timer = setTimeout(() => setShowAutosaved(false), 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      // Handle quota exceeded or other storage errors
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        console.error("localStorage quota exceeded");
        // Try to clear old data and retry once
        try {
          localStorage.removeItem(STORAGE_KEY);
          const dataToSave = { formFields, currentStep, selectedCategory, otherCategory, mealPlans, tncAccepted };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (retryErr) {
          console.error("Failed to save even after clearing:", retryErr);
        }
      } else {
        console.warn("Failed to save form data:", err);
      }
    }
  }, [formFields, currentStep, selectedCategory, otherCategory, mealPlans, tncAccepted, inviteStatus, isInitialLoad]);

  // ── Warn user before leaving page with unsaved changes ─────────────────
  useEffect(() => {
    if (typeof window === "undefined" || inviteStatus !== "valid" || submitted) return;

    const handleBeforeUnload = (e) => {
      // Only warn if form has some data filled
      const hasData = formFields.email || formFields.fullName || formFields.resortName ||
                     formFields.originStory || formFields.address;

      if (hasData) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // Some browsers require a return value
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formFields, inviteStatus, submitted]);

  const setField = (field) => (e) => {
    setFormFields((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const rightPanelRef = useRef(null);

  const scrollToTop = () => {
    setTimeout(() => rightPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      setFormFields({
        email: "", fullName: "", resortName: "", website: "", mainContact: "",
        address: "", mapsLink: "", numberOfRooms: "", roomTypes: "",
        originStory: "", natureBlend: "", naturalistPhilosophy: "",
        afterSafariVibe: "", conservation: "", uniquePoints: "",
        mediaLink: "", paymentMethod: "", cancelPolicyText: "",
      });
      setCurrentStep(0);
      setSelectedCategory("");
      setOtherCategory("");
      setMealPlans([]);
      setTncAccepted(false);
      setFactSheetFile(null);
      setCancelPolicyFile(null);
      setFieldErrors({});
      setHasRestoredData(false);
      setShowRestoredToast(false);
      localStorage.removeItem(STORAGE_KEY);
      scrollToTop();
    }
  };

  const validateStep = (step) => {
    const errors = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRe = /^https?:\/\/.+/i;

    if (step === 0) {
      if (!formFields.email.trim()) errors.email = "Email address is required.";
      else if (!emailRe.test(formFields.email)) errors.email = "Please enter a valid email address.";
      if (!formFields.fullName.trim()) errors.fullName = "Your full name is required.";
      if (!formFields.resortName.trim()) errors.resortName = "Resort name is required.";
      if (!formFields.website.trim()) errors.website = "Property website is required.";
      else if (!urlRe.test(formFields.website.trim()))
        errors.website = "Please enter a valid URL starting with https://.";
      if (!formFields.mainContact.trim()) errors.mainContact = "Main point of contact details are required.";
    }

    if (step === 1) {
      if (!formFields.address.trim()) errors.address = "Property address is required.";
      if (formFields.mapsLink.trim()) {
        const invalidLine = formFields.mapsLink.trim().split("\n").find((l) => l.trim() && !urlRe.test(l.trim()));
        if (invalidLine) errors.mapsLink = "Each link must be a valid URL starting with https://. Check: " + invalidLine.trim();
      }
      if (!formFields.numberOfRooms || Number(formFields.numberOfRooms) < 1)
        errors.numberOfRooms = "Please enter the total number of rooms (minimum 1).";
      if (!selectedCategory) errors.selectedCategory = "Please select a resort category.";
      if (selectedCategory === "other" && !otherCategory.trim())
        errors.otherCategory = "Please specify your resort category.";
      if (!formFields.roomTypes.trim()) errors.roomTypes = "Please list your room types.";
      if (mealPlans.length === 0) errors.mealPlans = "Please select at least one meal plan.";
    }

    if (step === 2) {
      ["originStory", "natureBlend", "naturalistPhilosophy", "afterSafariVibe", "conservation", "uniquePoints"].forEach((f) => {
        if (!formFields[f].trim()) errors[f] = "This field is required.";
        else if (formFields[f].trim().length < 10) errors[f] = "Please write at least 10 characters.";
      });
    }

    if (step === 3) {
      if (!formFields.mediaLink.trim()) errors.mediaLink = "Please provide a link to your media folder.";
      else if (!urlRe.test(formFields.mediaLink.trim())) errors.mediaLink = "Please enter a valid URL starting with https://.";
      if (!formFields.paymentMethod.trim()) errors.paymentMethod = "Payment method details are required.";
      if (!cancelPolicyFile && !formFields.cancelPolicyText.trim())
        errors.cancelPolicy = "Please upload a policy document or paste the cancellation terms below.";
    }

    return errors;
  };

  const handleMealPlan = (plan) => {
    setMealPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10 MB limit)
      const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum file size is 10 MB.`);
        e.target.value = ''; // Clear the input
        return;
      }
      setter(file);
    }
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      scrollToTop();
      return;
    }
    setFieldErrors({});
    setCurrentStep((s) => Math.min(s + 1, 3));
    scrollToTop();
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tncAccepted) {
      alert("Please accept the Terms & Conditions before submitting.");
      return;
    }

    // Double-check invite token exists
    if (!inviteToken) {
      setSubmitError("Invitation token is missing. Please use the invite link from your email.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const data = new FormData();
      Object.entries(formFields).forEach(([k, v]) => data.append(k, v));
      mealPlans.forEach((p) => data.append("mealPlans", p));
      data.append(
        "resortCategory",
        selectedCategory === "other" ? otherCategory : selectedCategory
      );
      if (factSheetFile) data.append("factSheet", factSheetFile);
      if (cancelPolicyFile) data.append("cancelPolicyFile", cancelPolicyFile);
      if (inviteToken) data.append("inviteToken", inviteToken);

      const res = await fetch("/api/register-lodge", { method: "POST", body: data });

      // Check if response is JSON before parsing
      const contentType = res.headers.get("content-type");
      let json;

      if (contentType && contentType.includes("application/json")) {
        json = await res.json();
      } else {
        // Response is not JSON - likely an error page
        const text = await res.text();
        throw new Error(`Server error: ${res.status}. Please try again or contact support.`);
      }

      if (!res.ok) throw new Error(json.error || "Submission failed. Please try again.");

      // Clear saved form data on successful submission
      localStorage.removeItem(STORAGE_KEY);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('[style*="color: #c0392b"]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Gate messages ---- */
  const GATE_MSGS = {
    missing:      { title: "Invitation Required",   body: "This form is by invitation only. Please use the personalized invite link sent to you by the Junglore team. If you haven't received one, please contact us at info@junglore.com." },
    not_found:    { title: "Invalid Invite Link",    body: "This invite link is not recognised. Please check your email or contact us at  for assistance." },
    invalid:      { title: "Invalid Invite Link",    body: "This invite link is not recognised. Please check your email or contact us for assistance." },
    already_used: { title: "Link Already Used",      body: "This invite link has already been used to submit an application. Each link is single-use only." },
    expired:      { title: "Invite Link Expired",    body: "This invite link has expired. Please reach out to the Junglore team to request a fresh one." },
  };

  /* ---- Checking spinner ---- */
  if (inviteStatus === "checking") {
    return (
      <>
        <div className={styles.gateScreen}>
          <div className={styles.gateSpinner} />
          <p className={styles.gateSubtitle}>Verifying your invitation…</p>
        </div>
        <Footer />
      </>
    );
  }

  /* ---- Gate error ---- */
  if (inviteStatus !== "valid") {
    const { title, body } = GATE_MSGS[inviteStatus] || GATE_MSGS.invalid;
    return (
      <>
        <div className={styles.gateScreen}>
          <div className={styles.gateIcon}>
            <Lock size={34} strokeWidth={1.4} color="#F1663F" />
          </div>
          <h2 className={styles.gateTitle}>{title}</h2>
          <p className={styles.gateSubtitle}>{body}</p>
          <Link href="/" className={styles.gateBackLink}>
            <ArrowLeft size={15} strokeWidth={2} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Back to home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  /* ---- Success ---- */
  if (submitted) {
    return (
      <>
        <div className={styles.successPage}>
          <img
            src="/assests/images/unmatched_hospitality.jpg"
            alt=""
            className={styles.successBgImg}
          />
          <div className={styles.successCard}>
            <div className={styles.successIconRing}>
              <CheckCircle2 size={44} strokeWidth={1.4} color="#1E2D27" />
            </div>
            <h2 className={styles.successTitle}>Application Received!</h2>
            <p className={styles.successText}>
              Thank you for applying to the Junglore Curated Collection. Our team will review
              your property and reach out within 48 hours.
            </p>
            <Link href="/" className={styles.successBackBtn}>
              <ArrowLeft size={16} strokeWidth={2} />
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ---- Main form ---- */
  return (
    <>
      {/* Toast notification for restored data */}
      {showRestoredToast && (
        <div style={{
          position: "fixed",
          top: showRestoredToast ? "24px" : "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1E2D27",
          color: "#fff",
          padding: "14px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "0.9rem",
          transition: "top 0.4s ease, opacity 0.4s ease",
          opacity: showRestoredToast ? 1 : 0,
          maxWidth: "90%",
        }}>
          <CheckCircle2 size={18} strokeWidth={2} color="#CDD999" />
          <div>
            <strong>Welcome back!</strong> Your progress has been restored. All changes are auto-saved.
          </div>
        </div>
      )}

      <div className={styles.splitWrap}>

        {/* ── Left Image Panel ── */}
        <aside className={styles.leftPanel}>
          {SIDE_DATA.map((item, i) => (
            <img
              key={i}
              src={item.img}
              alt=""
              className={`${styles.leftImg} ${currentStep === i ? styles.leftImgActive : ""}`}
            />
          ))}
          <div className={styles.leftOverlay} />

          <div className={styles.leftTop}>
            <img
              src="/assests/images/CL_whitelogo.svg"
              alt="Curated Lodges"
              className={styles.leftLogo}
            />
          </div>

          <div className={styles.leftBottom}>
            <div className={styles.leftSlide} key={currentStep}>
              <h2 className={styles.leftTitle}>{SIDE_DATA[currentStep].title}</h2>
              <p className={styles.leftDesc}>{SIDE_DATA[currentStep].desc}</p>
            </div>
          </div>
        </aside>

        {/* ── Side Dots (desktop) ── */}
        <div className={styles.sideDots}>
          {SIDE_DATA.map((_, i) => (
            <div
              key={i}
              className={`${styles.sideDot} ${currentStep === i ? styles.sideDotActive : ""} ${currentStep > i ? styles.sideDotDone : ""}`}
            />
          ))}
        </div>

        {/* ── Right Scrollable Panel ── */}
        <div className={styles.rightPanel} ref={rightPanelRef}>

          {/* Mobile progress pills */}
          <div className={styles.mobileProg}>
            {SIDE_DATA.map((_, i) => (
              <div
                key={i}
                className={`${styles.mobilePill} ${currentStep >= i ? styles.mobilePillActive : ""}`}
              />
            ))}
          </div>

          {/* Autosave indicator */}
          <div style={{
            textAlign: "center",
            marginTop: "12px",
            fontSize: "0.7rem",
            color: "#3a7a50",
            opacity: showAutosaved ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            minHeight: "18px",
          }}>
            {showAutosaved && (
              <>
                <CheckCircle2 size={11} strokeWidth={2.5} />
                Autosaved
              </>
            )}
          </div>

          <div className={styles.formInner}>
            <form onSubmit={handleSubmit} noValidate>

              {/* ══════════════════════════════════════════
                  STEP 0 — Contact & Property Basics
              ══════════════════════════════════════════ */}
              {currentStep === 0 && (
                <div className={styles.stepBody}>
                  <div className={styles.stepHeaderWrap}>
                    <div className={styles.stepIconWrap}>
                      <User size={22} strokeWidth={2} />
                    </div>
                    <p className={styles.stepLabel}>Getting to know <span className={styles.stepLabelFocus}>You & Your Property</span></p>
                  </div>
                  <h2 className={styles.stepHeading}>Contact &amp; Property Basics</h2>
                  <p className={styles.stepSubheading}>Let us know who you are and tell us about your property at a glance.</p>

                  <div className={`${styles.formGrid} ${styles.cols2}`}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Address <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}><Mail size={15} strokeWidth={2} /></span>
                        <input type="email" required className={`${styles.input} ${styles.hasIcon} ${fieldErrors.email ? styles.inputError : ""}`} placeholder="you@yourlodge.com" value={formFields.email} onChange={setField("email")} />
                      </div>
                      {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Your Full Name <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}><User size={15} strokeWidth={2} /></span>
                        <input type="text" required className={`${styles.input} ${styles.hasIcon} ${fieldErrors.fullName ? styles.inputError : ""}`} placeholder="e.g. Arjun Sharma" value={formFields.fullName} onChange={setField("fullName")} />
                      </div>
                      {fieldErrors.fullName && <span className={styles.fieldError}>{fieldErrors.fullName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Resort Name (Full Legal Name) <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}><Building2 size={15} strokeWidth={2} /></span>
                        <input type="text" required className={`${styles.input} ${styles.hasIcon} ${fieldErrors.resortName ? styles.inputError : ""}`} placeholder="e.g. Tigerland Wilderness Estate Pvt Ltd" value={formFields.resortName} onChange={setField("resortName")} />
                      </div>
                      {fieldErrors.resortName && <span className={styles.fieldError}>{fieldErrors.resortName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Property Website <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}><Globe size={15} strokeWidth={2} /></span>
                        <input type="url" required className={`${styles.input} ${styles.hasIcon} ${fieldErrors.website ? styles.inputError : ""}`} placeholder="https://yourlodge.com" value={formFields.website} onChange={setField("website")} />
                      </div>
                      {fieldErrors.website && <span className={styles.fieldError}>{fieldErrors.website}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}>Main Point of Contact <span className={styles.required}>*</span></label>
                      <div className={styles.helpText}>
                        <Info size={13} strokeWidth={2} />
                        Please provide the Name, Email, and Phone Number of the primary person for general communication and logistics.
                      </div>
                      <textarea required className={`${styles.textarea} ${fieldErrors.mainContact ? styles.inputError : ""}`} placeholder={"Name: \nEmail: \nPhone: "} value={formFields.mainContact} onChange={setField("mainContact")} />
                      {fieldErrors.mainContact && <span className={styles.fieldError}>{fieldErrors.mainContact}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  STEP 1 — Location & Accommodation
              ══════════════════════════════════════════ */}
              {currentStep === 1 && (
                <div className={styles.stepBody}>
                  <div className={styles.stepHeaderWrap}>
                    <div className={styles.stepIconWrap}>
                      <MapPinned size={22} strokeWidth={2} />
                    </div>
                    <p className={styles.stepLabel}>Mapping your <span className={styles.stepLabelFocus}>Wilderness Haven</span></p>
                  </div>
                  <h2 className={styles.stepHeading}>Location &amp; Accommodation Details</h2>
                  <p className={styles.stepSubheading}>Help us understand the physical location and offering of your property.</p>

                  <div className={`${styles.formGrid} ${styles.cols2}`}>
                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}><MapPinned size={14} strokeWidth={2} /> Physical Address of the Property <span className={styles.required}>*</span></label>
                      <textarea required className={`${styles.textarea} ${fieldErrors.address ? styles.inputError : ""}`} placeholder="Full postal address including district, state, country and PIN code" value={formFields.address} onChange={setField("address")} />
                      {fieldErrors.address && <span className={styles.fieldError}>{fieldErrors.address}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}><Globe size={14} strokeWidth={2} /> Google Maps Link(s)</label>
                      <div className={styles.helpText}>
                        <Info size={13} strokeWidth={2} />
                        Please provide the exact pin location. If you have multiple access points or properties, list all relevant links here.
                      </div>
                      <textarea className={`${styles.textarea} ${fieldErrors.mapsLink ? styles.inputError : ""}`} placeholder={"https://maps.google.com/?q=...\nhttps://maps.google.com/?q=... (if multiple)"} value={formFields.mapsLink} onChange={setField("mapsLink")} />
                      {fieldErrors.mapsLink && <span className={styles.fieldError}>{fieldErrors.mapsLink}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}><BedDouble size={14} strokeWidth={2} /> Total Number of Rooms / Tents / Villas <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}><BedDouble size={15} strokeWidth={2} /></span>
                        <input type="number" required min="1" className={`${styles.input} ${styles.hasIcon} ${fieldErrors.numberOfRooms ? styles.inputError : ""}`} placeholder="e.g. 12" value={formFields.numberOfRooms} onChange={setField("numberOfRooms")} />
                      </div>
                      {fieldErrors.numberOfRooms && <span className={styles.fieldError}>{fieldErrors.numberOfRooms}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Resort Category <span className={styles.required}>*</span></label>
                      <select
                        required
                        className={`${styles.select} ${fieldErrors.selectedCategory ? styles.inputError : ""}`}
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setOtherCategory(""); setFieldErrors((prev) => ({ ...prev, selectedCategory: "", otherCategory: "" })); }}
                      >
                        <option value="" disabled>Select a category…</option>
                        <option value="Luxury Safari Lodge">Luxury Safari Lodge</option>
                        <option value="Boutique Wildlife Resort">Boutique Wildlife Resort</option>
                        <option value="Premium Eco-Camp">Premium Eco-Camp</option>
                        <option value="Heritage Wilderness Property">Heritage Wilderness Property</option>
                        <option value="other">Other</option>
                      </select>
                      {fieldErrors.selectedCategory && <span className={styles.fieldError}>{fieldErrors.selectedCategory}</span>}
                      {selectedCategory === "other" && (
                        <input
                          type="text"
                          className={`${styles.input} ${fieldErrors.otherCategory ? styles.inputError : ""}`}
                          style={{ marginTop: "10px" }}
                          placeholder="Please specify your category…"
                          value={otherCategory}
                          onChange={(e) => { setOtherCategory(e.target.value); setFieldErrors((prev) => ({ ...prev, otherCategory: "" })); }}
                        />
                      )}
                      {fieldErrors.otherCategory && <span className={styles.fieldError}>{fieldErrors.otherCategory}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}><BedDouble size={14} strokeWidth={2} /> Room Type List <span className={styles.required}>*</span></label>
                      <div className={styles.helpText}>
                        <Info size={13} strokeWidth={2} />
                        Please list all bookable room types, each on a new line, with a short one-sentence description — e.g., &quot;Luxury Cottage – Our premier room with a private veranda&quot;.
                      </div>
                      <textarea required className={`${styles.textarea} ${styles.tall} ${fieldErrors.roomTypes ? styles.inputError : ""}`}
                        placeholder={"Luxury Cottage – Our premier room with a private veranda facing the forest\nDeluxe Jungle Suite – Spacious suite with open-air shower and jacuzzi\nSafari Tent – Authentic canvas tent with modern comforts and wildlife views"} value={formFields.roomTypes} onChange={setField("roomTypes")} />
                      {fieldErrors.roomTypes && <span className={styles.fieldError}>{fieldErrors.roomTypes}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}><Utensils size={14} strokeWidth={2} /> Meal Plans Available <span className={styles.required}>*</span></label>
                      <div className={`${styles.checkboxGroup} ${fieldErrors.mealPlans ? styles.checkboxGroupError : ""}`}>
                        {[
                          { label: "AP — All Meals", value: "AP" },
                          { label: "MAP — Breakfast & One Meal", value: "MAP" },
                          { label: "CP — Breakfast Only", value: "CP" },
                          { label: "EP — Room Only", value: "EP" },
                        ].map(({ label, value }) => (
                          <label key={value} className={`${styles.radioCard} ${mealPlans.includes(value) ? styles.radioCardActive : ""}`}>
                            <input type="checkbox" checked={mealPlans.includes(value)} onChange={() => { handleMealPlan(value); setFieldErrors((prev) => ({ ...prev, mealPlans: "" })); }} className={styles.radioInput} />
                            <span className={styles.radioMark}></span>
                            {label}
                          </label>
                        ))}
                      </div>
                      {fieldErrors.mealPlans && <span className={styles.fieldError}>{fieldErrors.mealPlans}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  STEP 2 — Ethos & Experience
              ══════════════════════════════════════════ */}
              {currentStep === 2 && (
                <div className={styles.stepBody}>
                  <div className={styles.stepHeaderWrap}>
                    <div className={styles.stepIconWrap}>
                      <Compass size={22} strokeWidth={2} />
                    </div>
                    <p className={styles.stepLabel}>Unveiling the <span className={styles.stepLabelFocus}>Magic of your Lodge</span></p>
                  </div>
                  <h2 className={styles.stepHeading}>The Junglore Ethos &amp; Experience</h2>
                  <p className={styles.stepSubheading}>This is the heart of your application. Take your time — we read every word.</p>

                  <div className={styles.formGrid}>
                    {[
                      { icon: <BookOpen size={14} strokeWidth={2} />, label: "The Origin Story", field: "originStory", help: "What is the story and vision behind building your lodge? We partner with passion projects — tell us why you chose this specific wilderness and what inspired you to create this space.", placeholder: "Share the moment, the journey, the conviction that led you here…" },
                      { icon: <Trees size={14} strokeWidth={2} />, label: "Blurring the Lines with Nature", field: "natureBlend", help: "How does your property's architecture and layout blend with the surrounding jungle ecosystem? (e.g., local materials, minimal ecological footprint, wildlife corridors)", placeholder: "Describe how the built environment dissolves into the natural one…" },
                      { icon: <Compass size={14} strokeWidth={2} />, label: "The Naturalist & Safari Philosophy", field: "naturalistPhilosophy", help: "Tell us about your guiding team. Do your naturalists hold special certifications? How do you ensure guests get a deeply educational and ethical wildlife tracking experience?", placeholder: "Guide certifications, tracking ethics, immersive learning formats…" },
                      { icon: <Sunset size={14} strokeWidth={2} />, label: "The After-Safari Vibe", field: "afterSafariVibe", help: "Describe the perfect evening at your lodge after a guest returns from an evening drive. Help us visualize the atmosphere.", placeholder: "Firepit stories, the sound of the jungle, hand-crafted cocktails under the stars…" },
                      { icon: <Heart size={14} strokeWidth={2} />, label: "Conservation & Community Footprint", field: "conservation", help: "How does your lodge actively give back to the local wildlife ecosystem or indigenous communities?", placeholder: "Reforestation drives, anti-poaching support, local employment, artisan partnerships…" },
                      { icon: <Sparkles size={14} strokeWidth={2} />, label: "What Makes Your Property Unique? (3–5 Key Selling Points)", field: "uniquePoints", help: "Tell us what makes your resort a true Junglore experience — e.g., \"Our resident biologist leads daily nature walks,\" or \"Located in a private conservancy for exclusive night drives.\"", placeholder: "1. \n2. \n3. \n4. \n5. " },
                    ].map(({ icon, label, field, help, placeholder }) => (
                      <div key={label} className={styles.formGroup}>
                        <label className={styles.label}>{icon} {label} <span className={styles.required}>*</span></label>
                        <div className={styles.helpText}><Info size={13} strokeWidth={2} />{help}</div>
                        <textarea required className={`${styles.textarea} ${styles.tall} ${fieldErrors[field] ? styles.inputError : ""}`} placeholder={placeholder} value={formFields[field]} onChange={setField(field)} />
                        {fieldErrors[field] && <span className={styles.fieldError}>{fieldErrors[field]}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  STEP 3 — Media & B2B Commercials
              ══════════════════════════════════════════ */}
              {currentStep === 3 && (
                <div className={styles.stepBody}>
                  <div className={styles.stepHeaderWrap}>
                    <div className={styles.stepIconWrap}>
                      <ImageIcon size={22} strokeWidth={2} />
                    </div>
                    <p className={styles.stepLabel}>Capturing the <span className={styles.stepLabelFocus}>Essence & Logistics</span></p>
                  </div>
                  <h2 className={styles.stepHeading}>Media &amp; B2B Commercials</h2>
                  <p className={styles.stepSubheading}>Marketing assets and financial logistics to get you listed and booked.</p>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}><ImageIcon size={14} strokeWidth={2} /> High-Resolution Images & Videos (Cloud Link) <span className={styles.required}>*</span></label>
                      <div className={styles.helpText}><Info size={13} strokeWidth={2} />Please provide a link to a cloud folder (Google Drive, Dropbox, WeTransfer, etc.) containing professional property, room, and experience photos.</div>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}><Globe size={15} strokeWidth={2} /></span>
                        <input type="url" required className={`${styles.input} ${styles.hasIcon} ${fieldErrors.mediaLink ? styles.inputError : ""}`} placeholder="https://drive.google.com/drive/folders/..." value={formFields.mediaLink} onChange={setField("mediaLink")} />
                      </div>
                      {fieldErrors.mediaLink && <span className={styles.fieldError}>{fieldErrors.mediaLink}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}><FileText size={14} strokeWidth={2} /> Resort Fact Sheet (PDF)</label>
                      <div className={styles.helpText}><Info size={13} strokeWidth={2} />If you have a comprehensive PDF fact sheet, please upload it here.</div>
                      <label className={styles.fileUploadWrap}>
                        <div className={styles.fileUploadIconWrap}><UploadCloud size={22} strokeWidth={1.5} color="#3a7a50" /></div>
                        <div className={styles.fileUploadText}>
                          <strong>{factSheetFile ? factSheetFile.name : "Click to upload PDF"}</strong>
                          <span>PDF · Max 10 MB</span>
                        </div>
                        <input type="file" accept=".pdf" className={styles.fileInput} onChange={(e) => handleFileChange(e, setFactSheetFile)} />
                      </label>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}><CreditCard size={14} strokeWidth={2} /> Preferred Payment Method for B2B Bookings <span className={styles.required}>*</span></label>
                      <div className={styles.helpText}><Info size={13} strokeWidth={2} />How will Junglore pay the resort for bookings? Please provide bank details or preferred gateway info (e.g., NEFT, SWIFT, Razorpay).</div>
                      <textarea required className={`${styles.textarea} ${fieldErrors.paymentMethod ? styles.inputError : ""}`} placeholder={"Bank Name: \nAccount Name: \nAccount Number: \nIFSC / SWIFT Code: \nOr preferred gateway: "} value={formFields.paymentMethod} onChange={setField("paymentMethod")} />
                      {fieldErrors.paymentMethod && <span className={styles.fieldError}>{fieldErrors.paymentMethod}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}><FileX2 size={14} strokeWidth={2} /> Cancellation Policy for B2B Partners <span className={styles.required}>*</span></label>
                      <div className={styles.helpText}><Info size={13} strokeWidth={2} />Upload your standard B2B cancellation and amendment policy document, or paste the terms below.</div>
                      <label className={styles.fileUploadWrap} style={{ marginBottom: "16px" }}>
                        <div className={styles.fileUploadIconWrap}><UploadCloud size={22} strokeWidth={1.5} color="#3a7a50" /></div>
                        <div className={styles.fileUploadText}>
                          <strong>{cancelPolicyFile ? cancelPolicyFile.name : "Upload policy document (optional)"}</strong>
                          <span>PDF or DOCX · Max 10 MB</span>
                        </div>
                        <input type="file" accept=".pdf,.doc,.docx" className={styles.fileInput} onChange={(e) => { handleFileChange(e, setCancelPolicyFile); setFieldErrors((prev) => ({ ...prev, cancelPolicy: "" })); }} />
                      </label>
                      <textarea className={`${styles.textarea} ${styles.tall} ${fieldErrors.cancelPolicy ? styles.inputError : ""}`} placeholder="Or paste your cancellation policy terms here…" value={formFields.cancelPolicyText} onChange={(e) => { setField("cancelPolicyText")(e); setFieldErrors((prev) => ({ ...prev, cancelPolicy: "" })); }} />
                      {fieldErrors.cancelPolicy && <span className={styles.fieldError}>{fieldErrors.cancelPolicy}</span>}
                    </div>
                    <div className={`${styles.formGroup} ${styles.spanFull}`}>
                      <label className={styles.label}><ScrollText size={14} strokeWidth={2} /> Terms &amp; Conditions <span className={styles.required}>*</span></label>
                      <p className={styles.stepSubheading} style={{ marginBottom: '16px' }}>Please read and accept our partnership agreement to finalise your application.</p>
                      
                      <div className={styles.tncSection}>
                        <div
                          className={styles.tncScrollBox}
                          dangerouslySetInnerHTML={{
                            __html: TERMS_CONTENT
                              .trim()
                              .split("\n\n")
                              .map((block) => {
                                const trimmed = block.trim();
                                if (/^\d+\./.test(trimmed)) {
                                  const [heading, ...rest] = trimmed.split("\n");
                                  return `<h4>${heading}</h4><p>${rest.join(" ").trim()}</p>`;
                                }
                                return `<p>${trimmed}</p>`;
                              })
                              .join(""),
                          }}
                        />

                        <label className={styles.tncCheckRow} htmlFor="tncCheckbox">
                          <div className={`${styles.tncCheckMark} ${tncAccepted ? styles.tncCheckMarkActive : ""}`}>
                            {tncAccepted && <CheckCircle2 size={14} strokeWidth={2.5} color="#fff" />}
                            <input type="checkbox" id="tncCheckbox" className={styles.tncCheckInput} checked={tncAccepted} onChange={(e) => setTncAccepted(e.target.checked)} />
                          </div>
                          <span className={styles.tncCheckLabel}>
                            I confirm that I have read and fully understood the Partnership Terms &amp; Conditions, and I agree to be bound by them on behalf of my property. I also confirm that all information provided in this application is accurate.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  STEP NAVIGATION
              ══════════════════════════════════════════ */}
              {currentStep < 3 ? (
                <div className={styles.stepNav}>
                  {currentStep > 0 && (
                    <button type="button" className={styles.prevBtn} onClick={prevStep}>
                      <ArrowLeft size={15} strokeWidth={2} />
                      Back
                    </button>
                  )}
                  <button type="button" className={styles.nextBtn} onClick={nextStep}>
                    Continue
                    <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className={styles.stepNav}>
                  <button type="button" className={styles.prevBtn} onClick={prevStep}>
                    <ArrowLeft size={15} strokeWidth={2} />
                    Back
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={!tncAccepted || isSubmitting}>
                    <Send size={17} strokeWidth={2} />
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                    {!isSubmitting && <span className={styles.submitBtnArrow}><ArrowRight size={16} strokeWidth={2.5} /></span>}
                  </button>
                </div>
              )}

              {currentStep === 3 && !tncAccepted && (
                <p style={{
                  color: "#F1663F",
                  textAlign: "center",
                  marginTop: "8px",
                  fontSize: "0.85rem",
                  fontStyle: "italic"
                }}>
                  Please accept the Terms & Conditions to submit your application.
                </p>
              )}

              {currentStep === 3 && (
                <>
                  {submitError && (
                    <p style={{ color: "#c0392b", textAlign: "center", marginTop: "12px", fontSize: "0.9rem" }}>
                      {submitError}
                    </p>
                  )}
                  <p className={styles.submitNote}>
                    Our team will review your application and respond within 48 hours.
                  </p>
                </>
              )}

            </form>

            {/* Clear form button at bottom */}
            <div style={{
              textAlign: "center",
              marginTop: "32px",
              marginBottom: "24px",
            }}>
              <button
                type="button"
                onClick={clearForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999",
                  fontSize: "0.8rem",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: "8px 12px",
                }}
                onMouseEnter={(e) => e.target.style.color = "#F1663F"}
                onMouseLeave={(e) => e.target.style.color = "#999"}
              >
                Clear Form & Start Over
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterLodgePage;
