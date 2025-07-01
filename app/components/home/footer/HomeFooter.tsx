import React from "react";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";

const HomeFooter = () => {
  return (
    <footer   id="contact" className=" py-10 px-4 sm:px-8 md:px-16 transition-all duration-300 bg-white bg-[url('/file2.svg')] ">
      <div className="footer-items grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-gray-700  ">
        {/* Section Description */}
        <div className="relative p-4 rounded-lg border border-gray-700 hover:border-[var(--secondary-color)] transition-all duration-300 group">
          <h1 className="text-2xl font-bold hover:text-[var(--secondary-color)] transition-colors duration-300 relative z-10 text-black">
            Perfect Research
          </h1>
          <p className="text-justify text-sm mt-2 hover:text-[var(--secondary-color)] transition-colors duration-300 relative z-10 text-black">
            Explorez l&lsquo;univers de la connaissance avec nous. Lorem ipsum dolor
            sit amet consectetur adipisicing elit.
          </p>
          <span className="absolute top-0 left-0 w-2 h-2 bg-[var(--secondary-color)] rounded-full animate-orbit"></span>
        </div>

        {/* Section Menu */}
        <div className="justify-center p-4">
          <h3 className="text-lg font-semibold hover:text-[var(--secondary-color)] transition-colors duration-300 border-b-2 border-transparent hover:border-[var(--secondary-color)] pb-1 text-black">
            Menu
          </h3>
          <nav className="mt-4 space-y-3">
            <Link
              href="#Acceuil"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
              Accueil
            </Link>
            <Link
              href="#Nos offres"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
            Documentation
            </Link>
            <Link
              href="#Nos offres"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
            Tarification
            </Link>
            {/* <Link
              href="#Nos offres"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
            Documentation
            </Link> */}
            {/* <Link
              href="#contact"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2"
            >
              Contact
            </Link> */}
            {/* <Link
              href="#donation"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2"
            >
              Faire un Don
            </Link> */}
          </nav>
        </div>

        {/* Section Produits et Réseaux Sociaux */}
        <div className="p-4">
          <h3 className="text-lg font-semibold hover:text-[var(--secondary-color)] transition-colors duration-300 border-b-2 border-transparent hover:border-[var(--secondary-color)] pb-1 text-black">
            Nos Offres
          </h3>
          <nav className="mt-4 space-y-3">
            <Link
              href="/pages/perfect/chat"
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
              Perfect Chat
            </Link>
            <Link
              href=""
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
              PerfectChat Pro
            </Link>

            <Link
              href=""
              className="block text-sm hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:translate-x-2 text-black"
            >
              PerfectChat Api
            </Link>
          </nav>

          <h3 className="text-lg font-semibold hover:text-[var(--secondary-color)] transition-colors duration-300 mt-6 border-b-2 border-transparent hover:border-[var(--secondary-color)] pb-1 text-black">
            Réseaux Sociaux
          </h3>
          <ul className="flex flex-row gap-6 mt-4">
            <li>
              <Link
                href="https://www.linkedin.com/in/tech-atelier-34085b351/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="relative group"
              >
                <FaLinkedin
                  className="text-gray-700 hover:text-[var(--secondary-color)] transition-all duration-300 transform group-hover:scale-125"
                  size={24}
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--secondary-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.facebook.com/profile.php?id=61573037603038"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="relative group"
              >
                <FaFacebook
                  className="text-gray-700 hover:text-[var(--secondary-color)] transition-all duration-300 transform group-hover:scale-125"
                  size={24}
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--secondary-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.tiktok.com/@tech_atelier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="relative group"
              >
                <FaTiktok
                  className="text-gray-700 hover:text-[var(--secondary-color)] transition-all duration-300 transform group-hover:scale-125"
                  size={24}
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--secondary-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Perfect Research. Tous droits réservés.
      </div>
    </footer>
  );
};

export default HomeFooter;
