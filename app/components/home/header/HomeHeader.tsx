"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

function HomeHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="my-4">
      {/* Menu principal (Desktop) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex-shrink-0 w-[150px]">
          <Image
            src="/assets/images/png/Plan de travail 1.png"
            alt="Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <ul className="flex flex-row items-center home-menu-center-items px-4 py-3">
          {/* <li className="mx-4">
            <Link href="/pages/perfect/chat">
              <span className="bold">Perfect Chat</span>
            </Link>
          </li> */}

          <li className="mx-4 my-2 ">
            <Link href="https://docs.perfectresearch.app/">
              <span>Documentation</span>
            </Link>
          </li>

          <li className="mx-4">
            <Link href="">
              <span className="bold">Tarifications</span>
            </Link>
          </li>
          <li className="mx-4">
            <Link href="#footer">
              <span className="bold">Contact</span>
            </Link>
          </li>
        </ul>

        <Link href="/pages/authentication/registration">
          <span className="btn btn-primary text-lg bold uppercase">
          Inscription
          </span>
        </Link>
      </div>

      {/* Menu mobile (Responsive) */}
      <div className="flex md:hidden flex-row items-center justify-between home-menu px-4">
        <div style={{ height: 70, width: 70 }}>
          <Image
            src="/assets/images/png/Plan de travail 1 copie.png"
            alt="Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>

        <button
          id="mobileMenuButton"
          type="button"
          className="text-black focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Fermer le menu mobile" : "Ouvrir le menu mobile"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Menu déroulant mobile */}
      {isMobileMenuOpen && (
        <ul className="md:hidden flex flex-col items-center home-menu-center-items px-4 py-3 absolute top-16 left-0 w-full bg-white z-10">
          {/* <li className="mx-4 my-2">
            <Link href="/pages/perfect/chat">
              <span>Perfect Chat</span>
            </Link>
          </li> */}

          <li className="mx-4 my-2">
            <Link href="https://docs.perfectresearch.app/">
              <span>Documentation</span>
            </Link>
          </li>
          <li className="mx-4 my-2">
            <Link href="/pages/perfect/research">
              <span>Perfect Research</span>
            </Link>
          </li>
          <li className="mx-4 my-2">
            <Link href="#contact">
              <span>Contact</span>
            </Link>
          </li>
          <li className="mx-4 my-2">
            <Link href="/pages/perfect/chat">
              <span className="btn btn-primary">Faire une demo</span>
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}

export default HomeHeader;
