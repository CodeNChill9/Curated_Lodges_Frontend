"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Layout/Header";
import HeaderLogin from "@/components/Layout/HeaderLogin";
import Footer from "@/components/Layout/Footer";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

const CuratedLodgesPage = () => {
  const isTokenRequired = useSelector((state) => state.tokenData.token);
  const [activeMarker, setActiveMarker] = useState(null);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const timelineRef = useRef(null);

  const lodges = [
    {
      id: 1,
      name: "Tigers' Heaven Resort",
      location: "India",
      position: { top: "52%", left: "69%" },
      image: "/assests/images/Tigerheaven.png",
      story: "India's oldest national park, home to diverse wildlife"
    },
    {
      id: 2,
      name: "Mara Choroa Camp",
      location: "Kenya",
      position: { top: "68%", left: "58%" },
      image: "/assests/images/Marachoroa.png",
      story: "Big Five encounters in South Africa's premier reserve"
    },
  ];
  const [currentText, setCurrentText] = useState(0);

  const animatedTexts = [
    "You built more than a lodge",
    "You created an experience",
    "Now, let us tell your story to the world"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % animatedTexts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTimelineVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .video-background-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: #000;
          display: flex;
          flex-direction: column;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .bottom-content {
          margin-top: auto;
          padding-bottom: 80px;
          text-align: center;
        }

        .animated-text-container {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .animated-text {
          font-size: 3.5rem;
          font-weight: 400;
          color: #fff;
          text-align: center;
          animation: fadeIn 1s ease-in-out;
          line-height: 1.2;
          max-width: 900px;
          padding: 0 20px;
          width: 100%;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .register-btn {
          background: #F1663F;
          color: #fff;
          border: none;
          padding: 14px 35px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .register-btn:hover {
          background: #d54d2a;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(241, 102, 63, 0.4);
        }

        .register-btn img {
          filter: brightness(0) invert(1);
        }

        .final-cta-section {
          position: relative;
          padding: 150px 0;
          text-align: center;
          overflow: hidden;
        }

        .final-cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.65);
          z-index: 1;
        }

        .final-cta-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }

        .final-cta-title {
          font-size: 4rem;
          font-weight: 400;
          color: #fff;
          margin-bottom: 30px;
          line-height: 1.2;
        }

        .final-cta-description {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
          margin-bottom: 50px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-final-cta {
          background: #F1663F;
          color: #fff;
          border: none;
          padding: 18px 45px;
          font-size: 1.125rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .btn-final-cta:hover {
          background: #d54d2a;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(241, 102, 63, 0.4);
        }

        .btn-final-cta img {
          filter: brightness(0) invert(1);
        }

        @media (max-width: 768px) {
          .video-background-section {
            min-height: 100vh;
          }
          
          .animated-text {
            font-size: 1.8rem;
          }

          .bottom-content {
            padding-bottom: 60px;
          }

          .register-btn {
            padding: 14px 32px;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .animated-text {
            font-size: 1.5rem;
          }
        }

        .partnership-section {
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
          padding: 60px 0 10px 0;
          text-align: center;
        }

        .partnership-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .partnership-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(241, 102, 63, 0.1);
          padding: 12px 24px;
          border-radius: 30px;
          margin-bottom: 30px;
        }

        .partnership-badge span {
          color: #F1663F;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .partnership-title {
          font-size: 3.5rem;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 30px;
        }

        .partnership-description {
          font-size: 1.25rem;
          color: #6c757d;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .partnership-section {
            padding: 60px 0;
          }

          .partnership-title {
            font-size: 2rem;
          }

          .partnership-description {
            font-size: 1rem;
          }
        }

        .benefits-wrapper {
          position: relative;
          min-height: 300vh;
        }

        .spotlight-section,
        .spotlight-section-2,
        .spotlight-section-3 {
          background: #fff;
          padding: 60px 0;
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
        }

        .spotlight-section {
          z-index: 1;
        }

        .spotlight-section-2 {
          z-index: 2;
        }

        .spotlight-section-3 {
          z-index: 3;
        }

        .spotlight-image {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 100%;
          min-height: 500px;
        }

        .spotlight-image img {
          height: 100% !important;
        }

        .spotlight-content {
          padding-left: 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .spotlight-content-reverse {
          padding-right: 60px;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .benefit-badge {
          display: inline-block;
          color: #F1663F;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .spotlight-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .spotlight-underline {
          width: 60px;
          height: 4px;
          background: #F1663F;
          margin-bottom: 30px;
        }

        .spotlight-description {
          font-size: 1.125rem;
          color: #6c757d;
          line-height: 1.8;
        }

        .founding-partners-section {
          position: relative;
          background: #1e2d27;
          padding: 80px 0 60px;
          text-align: center; 
          color: #fff;
          overflow: hidden;
        }

        .founding-partners-section .container {
          position: relative;
          z-index: 1;
        }

        .founding-partners-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .founding-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          padding: 12px 24px;
          border-radius: 30px;
          margin-bottom: 30px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 2px;
          color: #fff;
        }

        .founding-title {
          font-size: 4rem;
          font-weight: 600;
          margin-bottom: 30px;
          line-height: 1.2;
        }

        .founding-description {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto 50px;
        }

        .world-map-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .world-map {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 20px;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .world-map .map-background-image {
          opacity: 1;
          z-index: 0;
        }

        .map-svg {
          width: 100%;
          height: 100%;
        }

        .map-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
        }

        .marker-dot {
          width: 20px;
          height: 20px;
          background: #F1663F;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(241, 102, 63, 0.4);
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(241, 102, 63, 0.4), 0 0 0 0 rgba(241, 102, 63, 0.4);
          }
          50% {
            box-shadow: 0 4px 12px rgba(241, 102, 63, 0.6), 0 0 0 10px rgba(241, 102, 63, 0);
          }
        }

        .map-marker:hover .marker-dot {
          transform: scale(1.3);
          box-shadow: 0 6px 20px rgba(241, 102, 63, 0.6);
        }

        .lodge-card {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .lodge-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
        }

        .lodge-info {
          padding: 20px;
        }

        .lodge-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .lodge-location {
          font-size: 0.875rem;
          color: #6c757d;
          margin: 0;
        }

        .map-hint {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin-top: 20px;
          margin-bottom: 0;
        }

        .onboarding-section {
          background: #fff;
          padding: 120px 0;
        }

        .onboarding-header {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 80px;
        }

        .onboarding-title {
          font-size: 3.5rem;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 30px;
        }

        .onboarding-subtitle {
          font-size: 1.25rem;
          color: #6c757d;
          line-height: 1.6;
        }

        .onboarding-timeline {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline-line {
          position: absolute;
          top: 50px;
          left: 16.66%;
          right: 16.66%;
          height: 2px;
          background: #e0e0e0;
          z-index: 0;
        }

        .timeline-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0;
          background: #1e2d27;
        }

        .timeline-line.animate::after {
          animation: lineGrow 3s ease-out forwards;
        }

        @keyframes lineGrow {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .onboarding-step {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .step-number {
          width: 100px;
          height: 100px;
          background: #1e2d27;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          margin: 0 auto 30px;
          position: relative;
          z-index: 2;
          opacity: 0;
        }

        .onboarding-step.step-1 .step-number {
          animation: fadeInScale 0.6s ease-out forwards;
          animation-delay: 0.3s;
        }

        .onboarding-step.step-2 .step-number {
          animation: fadeInScale 0.6s ease-out forwards;
          animation-delay: 1.2s;
        }

        .onboarding-step.step-3 .step-number {
          animation: fadeInScale 0.6s ease-out forwards;
          animation-delay: 2.1s;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .step-description {
          font-size: 1rem;
          color: #6c757d;
          line-height: 1.8;
        }

        @media (max-width: 991px) {
          .benefits-wrapper {
            min-height: auto;
          }

          .spotlight-section,
          .spotlight-section-2,
          .spotlight-section-3 {
            padding: 60px 0;
            position: relative;
            min-height: auto;
            height: auto;
          }

          .spotlight-content {
            padding-left: 0;
            margin-top: 40px;
          }

          .spotlight-content-reverse {
            padding-right: 0;
            margin-top: 40px;
          }

          .spotlight-title {
            font-size: 2rem;
          }

          .spotlight-description {
            font-size: 1rem;
          }

          .founding-partners-section {
            padding: 50px 0 40px;
          }

          .founding-title {
            font-size: 2.5rem;
          }

          .founding-description {
            font-size: 1.125rem;
            margin-bottom: 30px;
          }

          .world-map {
            height: 350px;
          }

          .lodge-card {
            width: 280px;
          }

          .lodge-image-wrapper {
            height: 140px;
          }

          .timeline-line {
            display: none;
          }

          .onboarding-section {
            padding: 60px 0;
          }

          .onboarding-title {
            font-size: 2rem;
          }

          .onboarding-subtitle {
            font-size: 1rem;
          }

          .step-number {
            width: 80px;
            height: 80px;
            font-size: 1.5rem;
          }

          .step-title {
            font-size: 1.25rem;
          }

          .onboarding-step {
            margin-bottom: 40px;
          }

          .final-cta-section {
            padding: 80px 0;
            background-attachment: scroll;
          }

          .final-cta-title {
            font-size: 2.5rem;
          }

          .final-cta-description {
            font-size: 1rem;
            margin-bottom: 40px;
          }

          .btn-final-cta {
            padding: 16px 35px;
            font-size: 1rem;
          }
        }
      `}</style>

      <section className="video-background-section">
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://junglore.s3.ap-south-1.amazonaws.com/uploads/videos/Giraffe+Lodge+at+West+Midland+Safari+Park.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        
        <div className="content-wrapper">
          <div className="container">
            {isTokenRequired || isTokenRequired != null ? (
              <HeaderLogin />
            ) : (
              <Header />
            )}
          </div>

          <div className="bottom-content">
            <div className="animated-text-container">
              <h2 className="animated-text" key={currentText}>
                {animatedTexts[currentText]}
              </h2>
            </div>
            <Link 
              href="/register-lodge"
              className="register-btn"
            >
              Register Your Lodge
              <Image 
                src="/assests/images/up_arrow.svg" 
                alt="arrow" 
                width={18} 
                height={18}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="partnership-section">
        <div className="container">
          <div className="partnership-content">
            <div className="partnership-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F1663F"/>
              </svg>
              <span>WHAT SETS US APART</span>
            </div>
            <h2 className="partnership-title">
              More Than a Platform.
              <br />
              A Partnership.
            </h2>
            <p className="partnership-description">
              We don&apos;t just connect you with travelers. We tell your story, celebrate your vision, and amplify
              what makes your resort extraordinary.
            </p>
          </div>
        </div>
      </section>

      <div className="benefits-wrapper">
        <section className="spotlight-section">
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 col-md-6">
                <div className="spotlight-image">
                  <Image
                    src="/assests/images/pic2.png"
                    alt="Analytics Dashboard"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="spotlight-content">
                  <div className="benefit-badge">
                    BENEFIT 1
                  </div>
                  <h2 className="spotlight-title">
                    A Spotlight on Your Story
                  </h2>
                  <div className="spotlight-underline"></div>
                  <p className="spotlight-description">
                    Your property is not just a place to stay; it&apos;s a culmination of
                    passion, vision, and years of dedication. We don&apos;t believe in
                    generic listings. Our editorial team works closely with you to
                    craft a compelling narrative that captures the soul of your
                    lodge. Through stunning photography, immersive video, and
                    thoughtful storytelling, we create a digital experience that
                    mirrors the magic guests feel when they arrive at your door.
                    We don&apos;t just list you; we feature you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="spotlight-section-2">
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 col-md-6 order-lg-2">
                <div className="spotlight-image">
                  <Image
                    src="/assests/images/pic4.png"
                    alt="Wildlife Enthusiast"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 order-lg-1">
                <div className="spotlight-content-reverse">
                  <div className="benefit-badge">
                    BENEFIT 2
                  </div>
                  <h2 className="spotlight-title">
                    Access a High-Value Audience
                  </h2>
                  <div className="spotlight-underline"></div>
                  <p className="spotlight-description">
                    Our platform is built for a very specific type of traveler: the
                    discerning wildlife enthusiast. These are experienced
                    photographers, conservation advocates, and passionate
                    nature lovers who book longer stays, travel in smaller groups,
                    and deeply appreciate the unique value you offer. They are
                    not looking for the cheapest option; they are looking for the
                    right experience. By partnering with Junglore, you connect
                    directly with this global community of high-value guests who
                    will become your most loyal advocates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="spotlight-section-3">
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 col-md-6">
                <div className="spotlight-image">
                  <Image
                    src="/assests/images/pic5.png"
                    alt="Modern Technology"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="spotlight-content">
                  <div className="benefit-badge">
                    BENEFIT 3
                  </div>
                  <h2 className="spotlight-title">
                    Seamless, Modern Technology
                  </h2>
                  <div className="spotlight-underline"></div>
                  <p className="spotlight-description">
                    We understand that your focus needs to be on your guests, not on managing complex booking systems. That's why we&apos;ve built an intuitive admin dashboard that puts you in complete control—without the complexity. Set your availability with a simple calendar, manage bookings with a click, and let our system handle guest confirmations automatically. No technical expertise required. Real-time updates ensure your property is always accurately represented online—all without any manual synchronization or technical headaches. No complex processes. Just a seamless, elegant connection that works in the background, so you can focus on what you do best.
                    {/* We understand that your focus needs to be on your guests,
                    not on managing multiple booking platforms. That's why we've
                    built a system that integrates directly with your existing
                    Channel Manager. Real-time availability, instant booking
                    confirmations, and automatic synchronization across all your
                    systems—all without any manual input from your team. No
                    new software to learn. No complex processes. Just a
                    seamless, elegant connection that works in the background,
                    so you can focus on what you do best. */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="founding-partners-section">
        <div className="container">
          <div className="founding-partners-content">
            <div className="founding-badge">
              FOUNDING PARTNERS
            </div>
            <h2 className="founding-title">
              You&apos;re in Good Company
            </h2>
            <p className="founding-description">
              Join an exclusive collection of the world&apos;s most distinguished wildlife lodges
            </p>
          </div>

          <div className="world-map-container">
            <div className="world-map">
              <Image
                src="/assests/images/map_trips.png"
                alt="World Map"
                fill
                style={{ objectFit: 'contain' }}
                className="map-background-image"
              />
              {lodges.map((lodge) => (
                <div
                  key={lodge.id}
                  className="map-marker"
                  style={{ top: lodge.position.top, left: lodge.position.left }}
                  onMouseEnter={() => setActiveMarker(lodge.id)}
                  onMouseLeave={() => setActiveMarker(null)}
                >
                  <div className="marker-dot"></div>
                  {activeMarker === lodge.id && (
                    <div className="lodge-card">
                      <div className="lodge-image-wrapper">
                        <Image
                          src={lodge.image}
                          alt={lodge.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="lodge-info">
                        <h3 className="lodge-name">{lodge.name}</h3>
                        <p className="lodge-location">{lodge.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="map-hint">Hover over the markers to preview our featured lodges</p>
          </div>
        </div>
      </section>

      <section className="onboarding-section">
        <div className="container">
          <div className="onboarding-header">
            <h2 className="onboarding-title">
              A Partnership Built on Respect for Your Time
            </h2>
            <p className="onboarding-subtitle">
              We&apos;ve designed a seamless onboarding experience that requires minimal effort from you. Three simple steps to join an exclusive collection.
            </p>
          </div>

          <div className="onboarding-timeline" ref={timelineRef}>
            <div className={`timeline-line ${isTimelineVisible ? 'animate' : ''}`}></div>
            
            <div className="row">
              <div className="col-lg-4 col-md-4 col-12">
                <div className={`onboarding-step ${isTimelineVisible ? 'step-1' : ''}`}>
                  <div className="step-number">01</div>
                  <h3 className="step-title">Register Interest</h3>
                  <p className="step-description">
                    Submit your initial details via our simple online form. It takes less than 10-15 minutes and gives us the essential information we need to understand your property and vision.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-12">
                <div className={`onboarding-step ${isTimelineVisible ? 'step-2' : ''}`}>
                  <div className="step-number">02</div>
                  <h3 className="step-title">Introductory Call</h3>
                  <p className="step-description">
                    Our founder will personally schedule a call to discuss our shared vision. This is a conversation, not a sales pitch. We want to ensure this partnership is the right fit for both of us.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-12">
                <div className={`onboarding-step ${isTimelineVisible ? 'step-3' : ''}`}>
                  <div className="step-number">03</div>
                  <h3 className="step-title">Seamless Onboarding</h3>
                  <p className="step-description">
                    Our team handles the technical setup, connecting to your existing systems with zero disruption. We coordinate the photography and storytelling process at a time that works for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <Image
          src="/assests/images/unmatched_hospitality.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="final-cta-overlay"></div>
        <div className="container">
          <div className="final-cta-content">
            <h2 className="final-cta-title">
              Are you ready to be discovered?
            </h2>
            <p className="final-cta-description">
              The first step is a simple introduction. Begin your application to be considered for the Junglore Curated Collection. Our partnership team will review your property and reach out within 48 hours.
            </p>
            <Link 
              href="/register-lodge"
              className="btn-final-cta"
            >
              Register Your Lodge
              <Image 
                src="/assests/images/up_arrow.svg" 
                alt="arrow" 
                width={18} 
                height={18}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CuratedLodgesPage;
