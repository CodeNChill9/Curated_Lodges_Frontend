"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = ({ forceVisible = false, forceScrolled = false, darkMode = false }) => {
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (forceVisible && forceScrolled) {
      setIsVisible(true);
      setIsScrolled(true);
      return;
    }

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!forceScrolled) {
        setIsScrolled(currentScrollY > 20);
      }
      
      if (!forceVisible) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY, forceVisible, forceScrolled]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : styles.transparent} ${!isVisible ? styles.hidden : ''} ${darkMode ? styles.darkMode : ''}`}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logo}>
            <Image 
              src={isScrolled ? "/assests/images/curatedlodges_logo.svg" : "/assests/images/CL_whitelogo.svg"}
              alt="Curated Lodges"
              width={180}
              height={45}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
