"use client"; // Ajoute cette ligne en haut du fichier

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdAddCircle, MdAttachMoney } from "react-icons/md"; // Import des icônes

export const HomeDonation = () => {
  const [showCustomAmount, setShowCustomAmount] = useState(false);

  const handlePersonalizeClick = () => {
    setShowCustomAmount(!showCustomAmount);
  };

  // Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const bounce = {
    hover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  const rotate3D = {
    hover: { rotateY: 180, scale: 1.1, transition: { duration: 0.8 } },
  };

  return (
    <div id="webcrumbs" className="w-full flex justify-center bg-sky-500 bg-[url('/file2.svg')]">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="w-full bg-gradient-to-br from-[var(--tertiary-color)] to-[var(--secondary-color)] relative overflow-hidden py-12 sm:py-20 px-6 sm:px-16 shadow-2xl"
        style={{ fontFamily: "var(--font-primary)" }}
      >



        {/* Background SVG */}
        <div className="absolute inset-0 opacity-20 after-banner">
          <div className="absolute w-full h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 696 316"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            />
              <path
                d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
                stroke="url(https://webcrumbs.cloud/placeholder)"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
              {[...Array(30)].map((_, i) => (
                <path
                  key={i}
                  d={`M${-380 + i * 7} ${-189 - i * 8}C${-380 + i * 7} ${
                    -189 - i * 8
                  } ${-312 + i * 7} ${216 - i * 8} ${152 + i * 7} ${
                    343 - i * 8
                  }C${616 + i * 7} ${470 - i * 8} ${684 + i * 7} ${
                    875 - i * 8
                  } ${684 + i * 7} ${875 - i * 8}`}
                  stroke={`url(https://webcrumbs.cloud/placeholder)`}
                  strokeOpacity="0.4"
                  strokeWidth="0.5"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
              <defs>
                <radialGradient
                  id="paint0_radial"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
                >
                  <stop offset="0.0666667" stopColor="var(--tertiary-color)" />
                  <stop offset="0.243243" stopColor="var(--secondary-color)" />
                  <stop
                    offset="0.43594"
                    stopColor="var(--secondary-color)"
                    stopOpacity="0"
                  />
                </radialGradient>
                {[...Array(30)].map((_, i) => (
                  <linearGradient
                    key={i}
                    id={`grad${i}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--tertiary-color)" stopOpacity="0" />
                    <stop offset="0.3" stopColor="var(--tertiary-color)" />
                    <stop offset="0.6" stopColor="var(--secondary-color)" />
                    <stop
                      offset="1"
                      stopColor="var(--secondary-color)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                ))}
              </defs>
            {/* </svg> */}
          </div>
        </div>

        

        <div className="relative z-10">
          {/* Titre et Sous-titre */}
          <motion.div
            variants={fadeInUp}
            className="head-items text-center mb-12 sm:mb-16"
          >
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="title text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--grey)] to-[var(--white)] mb-4 tracking-wide"
            >
              Soutenez la communauté
            </motion.h1>
            <motion.p
              whileHover={{ scale: 1.02 }}
              className="sub-title ligth sm:text-xl text-[var(--grey)] tracking-wide hover:text-[var(--white)] transition-colors duration-300"
            >
              Faites un don pour encourager la communauté .
            </motion.p>
          </motion.div>

          {/* Contenu Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* Image du Globe */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center relative"
            >
              <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-[var(--secondary-color)] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <motion.div
                whileHover="hover"
                variants={rotate3D}
                className="relative group perspective"
              >
                <img
                  src="assets/gifs/vecteezy-cartoon-world-revolve-unscreen.gif"
                  alt="Cartoon World Revolve"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain rounded-full p-2 bg-gradient-to-br from-[var(--tertiary-color)]/20 to-[var(--secondary-color)]/20 backdrop-blur-sm"
                />
              </motion.div>
            </motion.div>

            {/* Formulaire de Don */}
            <motion.div
              variants={fadeInUp}
              className="backdrop-blur-sm bg-[var(--white)]/10 p-6 sm:p-8 rounded-[var(--primary-radius)] border border-[var(--white)]/20 shadow-xl"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--grey)] mb-6 sm:mb-8 text-center">
                Choisir un montant à donner
              </h1>

              {/* Montants Prédéfinis */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[10, 20, 30].map((amount) => (
                  <motion.label
                    key={amount}
                    whileHover="hover"
                    whileTap="tap"
                    variants={bounce}
                    className="cursor-pointer relative group"
                  >
                    <input
                      type="radio"
                      name="amount"
                      value={amount}
                      id={`amount-${amount}`}
                      className="hidden peer"
                    />
                    <div className="px-4 py-5 bg-[var(--white)]/10 backdrop-blur-md border border-[var(--white)]/30 rounded-[var(--primary-radius)] text-center text-[var(--white)] font-medium transition-all duration-300 hover:bg-[var(--tertiary-color)]/30 hover:border-[var(--tertiary-color)] peer-checked:bg-[var(--tertiary-color)]/50 peer-checked:border-[var(--tertiary-color)] peer-checked:shadow-lg">
                      ${amount}
                    </div>
                  </motion.label>
                ))}
              </div>

              {/* Montant Personnalisé */}
              <div className="mb-8">
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  onClick={handlePersonalizeClick}
                  className="text-[var(--grey)] cursor-pointer hover:text-[var(--white)] transition-all duration-300 hover:underline inline-flex items-center text-sm"
                >
                  <MdAddCircle className="mr-1 text-lg" />{" "}
                  {/* Icône React Icons */}
                  Personnaliser le montant
                </motion.p>

                {showCustomAmount && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <label
                      htmlFor="custom-amount"
                      className="block text-[var(--grey)] transition-colors duration-300 mb-2"
                    >
                      Entrez un montant personnalisé
                    </label>
                    <div className="relative">
                      {/* Icône de devise */}
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdAttachMoney className="text-white text-lg" />
                      </div>
                      {/* Input */}
                      <input
                        type="number"
                        id="custom-amount"
                        name="custom-amount"
                        className="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--white)]/20 rounded-[var(--primary-radius)] focus:ring-2 focus:ring-[var(--tertiary-color)] transition-all duration-300 text-[var(--white)] placeholder-[var(--grey)]/70 hover:border-[var(--tertiary-color)] focus:border-[var(--tertiary-color)]"
                        placeholder="0.00"
                      />
                      {/* Effet de gradient au survol */}
                      <div className="absolute inset-0 rounded-[var(--primary-radius)] bg-gradient-to-r from-[var(--tertiary-color)]/0 via-[var(--tertiary-color)]/20 to-[var(--primary-color)]/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Fréquence de Versement */}
              <div className="mb-8">
                <p className="text-[var(--grey)] transition-colors duration-300 mb-4">
                  Choisir une fréquence de versement
                </p>
                <form className="space-y-4">
                  <div className="flex flex-row gap-5">
                    {["Mensuel", "Annuel"].map((frequency, idx) => (
                      <motion.div
                        key={frequency}
                        whileHover="hover"
                        whileTap="tap"
                        variants={bounce}
                        className="w-full relative group"
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={idx}
                          id={frequency.toLowerCase()}
                          className="hidden peer"
                        />
                        <label
                          htmlFor={frequency.toLowerCase()}
                          className="flex justify-center items-center px-4 py-3 bg-[var(--white)]/10 backdrop-blur-sm border border-[var(--white)]/30 rounded-[var(--primary-radius)] text-center text-[var(--grey)] font-medium transition-all duration-500 hover:bg-[var(--tertiary-color)]/30 hover:border-[var(--tertiary-color)] peer-checked:bg-[var(--tertiary-color)]/50 peer-checked:border-[var(--tertiary-color)] peer-checked:shadow-lg w-full cursor-pointer"
                        >
                          {frequency}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </form>
              </div>

              {/* Bouton Donner */}
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary w-full"
              >
                Donner
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomeDonation;

