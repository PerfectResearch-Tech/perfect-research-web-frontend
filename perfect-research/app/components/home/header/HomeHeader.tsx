"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false); // Pour le dropdown Products
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Pour le menu mobile

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation pour éviter que useEffect ne ferme immédiatement
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        !target.closest("#dropdownHoverButton") &&
        !target.closest("#dropdownHover") &&
        !target.closest("#mobileDropdownButton") &&
        !target.closest("#mobileDropdown") &&
        !target.closest("#mobileMenuButton")
      ) {
        setIsOpen(false); // Ferme le dropdown
        setIsMobileMenuOpen(false); // Ferme le menu mobile
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="my-4">
      {/* Menu principal (Desktop) */}
      <div className="hidden md:flex flex-row items-center justify-between home-menu">
        <span
          className="bg-slate-600 rounded-lg"
          style={{ height: 1150, width: 1000 }}
          
        ></span>

        <ul className="flex flex-row items-center home-menu-center-items px-4 py-3">
          <li className="mx-4">
            <button
              onClick={toggleDropdown}
              id="dropdownHoverButton"
              className="text-dark focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center"
              type="button"
            >
              Products
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {isOpen && (
              <div
                id="dropdownHover"
                className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link href="/pages/perfect/chat">
                      <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Perfect Chat
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="pages/perfect/research">
                      <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Perfect Research
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li className="mx-4">
            <Link href="/doc">
              <span>Doc</span>
            </Link>
          </li>

          <li className="mx-4">
            <Link href="#contact">
              <span>Contact</span>
            </Link>
          </li>

          <li className="mx-4">
            <Link href="#donation">
              <span>Faire un don</span>
            </Link>
          </li>
        </ul>

        <Link href="pages/perfect/chat">
          <span className="btn btn-primary">Faire une demo</span>
        </Link>
      </div>

      {/* Menu mobile (Responsive) */}
      <div className="flex md:hidden flex-row items-center justify-between home-menu px-4">
        <span
          className="bg-slate-600 rounded-lg"
          style={{ height: 50, width: 50 }}
        ></span>

        <button
          id="mobileMenuButton"
          className="text-white focus:outline-none"
          onClick={toggleMobileMenu}
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
          <li className="mx-4 my-2">
            <button
              onClick={toggleDropdown}
              id="mobileDropdownButton"
              className="text-dark focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center"
              type="button"
            >
              Products
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {isOpen && (
              <div
                id="mobileDropdown"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link href="/pages/perfect/chat">
                      <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Perfect Chat
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="pages/perfect/research">
                      <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Perfect Research
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li className="mx-4 my-2">
            <Link href="/doc">
              <span>Doc</span>
            </Link>
          </li>

          <li className="mx-4 my-2">
            <Link href="#contact">
              <span>Contact</span>
            </Link>
          </li>

          <li className="mx-4 my-2">
            <Link href="#donation">
              <span>Faire un don</span>
            </Link>
          </li>

          <li className="mx-4 my-2">
            <Link href="pages/perfect/chat">
              <span className="btn btn-primary">Faire une demo</span>
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}

export default HomeHeader;
