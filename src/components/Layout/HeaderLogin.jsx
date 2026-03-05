"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const HeaderLogin = () => {
  return (
    <header className={`${styles.header} ${styles.scrolled}`}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/assests/images/curatedlodges_logo.svg"
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

export default HeaderLogin;
