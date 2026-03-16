"use client";
import Header from "@/components/Layout/Header";
import HeaderLogin from "@/components/Layout/HeaderLogin";
import Footer from "@/components/Layout/Footer";
import { useSelector } from "react-redux";
import styles from "./page.module.css";

export default function TermsConditionsPage() {
  const isTokenRequired = useSelector((state) => state.tokenData.token);

  return (
    <>
      {isTokenRequired ? <HeaderLogin /> : <Header />}

      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Legal</span>
            <h1 className={styles.heroTitle}>Terms &amp; Conditions for Property Listings</h1>
            <p className={styles.heroSub}>
              Please read these terms carefully before listing your property on Curated Lodges.
            </p>
          </div>
        </div>

        {/* Document */}
        <div className={styles.docWrap}>
          <div className={styles.docCard}>

            {/* Section 1 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>01</span>
                <h2 className={styles.sectionTitle}>Scope of Agreement</h2>
              </div>
              <p className={styles.para}>
                By listing a property on Curated Lodges (&ldquo;Platform&rdquo;), the Partner agrees to be bound
                by these Terms and Conditions. This agreement is entered into between the Partner and
                CloudsAvenue TechSolutions LLP, a Limited Liability Partnership incorporated in India.
              </p>
            </div>

            <div className={styles.divider} />

            {/* Section 2 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>02</span>
                <h2 className={styles.sectionTitle}>Content Submission &amp; Intellectual Property (IP)</h2>
              </div>
              <p className={styles.para}>
                To ensure a high-quality user experience and legal safety for the Platform, the following
                rules apply to all uploaded media (photographs, videos, and text):
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Ownership Warranty:</strong> The Partner represents and warrants that they are
                  the sole owner of, or have obtained all necessary legal licenses for, all photographs,
                  videos, and information shared with Curated Lodges.
                </li>
                <li>
                  <strong>Freedom from Encumbrances:</strong> All content must be free from any
                  intellectual property disputes, third-party copyrights, or legal liens.
                </li>
                <li>
                  <strong>Usage License:</strong> The Partner grants CloudsAvenue TechSolutions LLP a
                  non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, display,
                  and distribute the submitted media for marketing, advertising, and operational purposes
                  on the Platform and its social media channels.
                </li>
                <li>
                  <strong>Indemnity for Content:</strong> The Partner shall indemnify and hold Curated
                  Lodges and Junglore harmless against any third-party claims, legal actions, or expenses
                  arising from a breach of intellectual property rights related to the submitted content.
                </li>
              </ul>
            </div>

            <div className={styles.divider} />

            {/* Section 3 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>03</span>
                <h2 className={styles.sectionTitle}>Property Information Accuracy</h2>
              </div>
              <p className={styles.para}>
                The Partner is responsible for maintaining the accuracy of room rates, availability,
                amenities, and descriptive text. Any bookings made based on incorrect information
                provided by the Partner must be honored at the Partner&apos;s expense.
              </p>
            </div>

            <div className={styles.divider} />

            {/* Section 4 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>04</span>
                <h2 className={styles.sectionTitle}>Ownership &amp; Brand Identity</h2>
              </div>
              <ul className={styles.list}>
                <li>
                  The Platform &ldquo;Curated Lodges&rdquo; and the technology &ldquo;Junglore&rdquo; are the exclusive
                  intellectual property of CloudsAvenue TechSolutions LLP.
                </li>
                <li>
                  Listing a property does not grant the Partner any rights to use the trademarks or
                  logos of Curated Lodges, Junglore, or CloudsAvenue without prior written consent.
                </li>
              </ul>
            </div>

            <div className={styles.divider} />

            {/* Section 5 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>05</span>
                <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
              </div>
              <p className={styles.para}>To the maximum extent permitted by Indian law:</p>
              <ul className={styles.list}>
                <li>
                  CloudsAvenue TechSolutions LLP shall not be liable for any indirect, incidental, or
                  consequential damages (including loss of profits) arising out of the use of the Platform.
                </li>
                <li>
                  Our total liability for any claim arising under these terms shall not exceed the total
                  commission fees paid by the Partner to the Platform in the three (3) months preceding
                  the claim.
                </li>
                <li>
                  The Platform is not responsible for the conduct of guests or any damage caused by
                  guests to the Partner&apos;s property.
                </li>
              </ul>
            </div>

            <div className={styles.divider} />

            {/* Section 6 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>06</span>
                <h2 className={styles.sectionTitle}>Termination</h2>
              </div>
              <p className={styles.para}>
                Either party may terminate the listing agreement with a 30-day written notice. Upon
                termination, Curated Lodges will remove the listing, but may retain media already used
                in printed marketing materials or historical archives.
              </p>
            </div>

            <div className={styles.divider} />

            {/* Section 7 */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>07</span>
                <h2 className={styles.sectionTitle}>Governing Law &amp; Dispute Resolution</h2>
              </div>
              <ul className={styles.list}>
                <li>
                  <strong>Governing Law:</strong> These terms are governed by and construed in
                  accordance with the laws of India.
                </li>
                <li>
                  <strong>Jurisdiction:</strong> Any legal disputes, controversies, or claims arising
                  out of this agreement shall be subject to the exclusive jurisdiction of the courts
                  in Mumbai, India.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
