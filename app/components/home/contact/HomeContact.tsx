"use client";
import React from "react";
import { motion } from "framer-motion";
import GlobeDemo from "../../ui/GlobeDemo";

const HomeContact = () => {
  return (
    <motion.section
      className="home-contact py-20 px-4 sm:px-8 md:px-16 relative overflow-hidden"
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Fond Galactique */}
      <div className="absolute inset-0 bg-[url('/path/to/space-background.jpg')] bg-cover bg-center opacity-20"></div>

      {/* Effet d'étoiles */}
      <div className="absolute inset-0 bg-[url('/path/to/stars.png')] bg-cover bg-center opacity-30"></div>

      {/* Titre et Sous-titre */}
      <motion.h1
        className="text-white title  sm:text-6xl font-bold mb-4 text-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Contact
      </motion.h1>
      <motion.p
        className="text-white righteous sub-title text-lg sm:text-xl mb-8 text-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Contactez-nous pour prendre un rendez-vous
      </motion.p>

      {/* Contenu Principal */}
      <div className="contact-items grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 items-center">
        {/* Formulaire de Contact */}
        <div className="contact-left-items">
          <div className="flex flex-col sm:flex-row gap-5">
            <motion.input
              type="text"
              placeholder="Nom"
              className="contact-input text-white placeholder-white/70 px-4 py-3 righteous bg-transparent border border-[var(--white)]/20 rounded-lg transition-all duration-300 ease-in-out hover:border-[var(--tertiary-color)] focus:border-[var(--tertiary-color)] focus:ring-2 focus:ring-[var(--tertiary-color)] w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            />
            <motion.input
              type="text"
              placeholder="Prénom"
              className="contact-input text-white placeholder-white/70 px-4 py-3 righteous bg-transparent border border-[var(--white)]/20 rounded-lg transition-all duration-300 ease-in-out hover:border-[var(--tertiary-color)] focus:border-[var(--tertiary-color)] focus:ring-2 focus:ring-[var(--tertiary-color)] w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            />
          </div>
          <br />
          <motion.input
            type="email"
            placeholder="Email"
            className="contact-input text-white placeholder-white/70 px-4 py-3 righteous bg-transparent border border-[var(--white)]/20 rounded-lg transition-all duration-300 ease-in-out hover:border-[var(--tertiary-color)] focus:border-[var(--tertiary-color)] focus:ring-2 focus:ring-[var(--tertiary-color)] w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          />
          <br />
          <motion.input
            type="number"
            placeholder="Numéro de téléphone"
            className="contact-input text-white placeholder-white/70 px-4 py-3 righteous bg-transparent border border-[var(--white)]/20 rounded-lg transition-all duration-300 ease-in-out hover:border-[var(--tertiary-color)] focus:border-[var(--tertiary-color)] focus:ring-2 focus:ring-[var(--tertiary-color)] w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          />
          <br />
          <motion.textarea
            id="message"
            name="message"
            cols={20}
            rows={8}
            placeholder="Votre Message ici..."
            className="contact-input text-white placeholder-white/70 px-4 py-3 righteous bg-transparent border border-[var(--white)]/20 rounded-lg transition-all duration-300 ease-in-out hover:border-[var(--tertiary-color)] focus:border-[var(--tertiary-color)] focus:ring-2 focus:ring-[var(--tertiary-color)] w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          />

          <br />
          <br />

          <motion.button
            className="btn btn-contact bg-[var(--tertiary-color)] text-white px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-[var(--primary-color)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
          >
            Envoyer
          </motion.button>
        </div>

        {/* Globe Spatial */}
        <div className="flex items-center justify-center">
          <GlobeDemo />
        </div>
      </div>
    </motion.section>
  );
};

export default HomeContact;

// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import GlobeDemo from "../../ui/GlobeDemo";

// const HomeContact = () => {
//   return (
//     <motion.section
//       className="home-contact py-20 px-4 sm:px-8 md:px-16"
//       id="contact"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7, ease: "easeOut" }}
//       whileHover={{ scale: 1.02 }}
//     >
//       <h1 className="warrior text-white title">Contact</h1>
//       <p className="text-white righteous sub-title ">
//         Contactez nous pour prendre un rendez-vous
//       </p>

//       <br />
//       <br />

//       <div className="contact-items grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="contact-left-items">
//           <div className="flex flex-col sm:flex-row gap-5">
//             <input
//               type="text"
//               name=""
//               id=""
//               placeholder="Nom"
//               className="contact-input text-white placeholder-white px-4 py-3 righteous transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:ring-2 hover:ring-primary-color w-full"
//             />
//             <input
//               type="text"
//               name=""
//               id=""
//               placeholder="Prénom"
//               className="contact-input text-white placeholder-white px-4 py-3 righteous transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:ring-2 hover:ring-primary-color w-full"
//             />
//           </div>
//           <br />
//           <input
//             type="email"
//             name=""
//             id=""
//             placeholder="Email"
//             className="contact-input text-white placeholder-white px-4 py-3 righteous transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:ring-2 hover:ring-primary-color w-full"
//           />
//           <br />
//           <input
//             type="number"
//             name=""
//             id=""
//             placeholder="Numéro de téléphone"
//             className="contact-input text-white placeholder-white px-4 py-3 righteous transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:ring-2 hover:ring-primary-color w-full"
//           />
//           <br />
//           <textarea
//             id="message"
//             name="message"
//             cols={30}
//             rows={8}
//             placeholder="Votre Message ici..."
//             className="contact-input text-white placeholder-white px-4 py-3 righteous transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:ring-2 hover:ring-primary-color w-full"
//           />

//           <br />
//           <br />

//           <button className="btn btn-contact transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-primary-color hover:text-white w-full sm:w-auto">
//             Envoyer
//           </button>
//         </div>
//         <div className="flex items-center justify-center">
//           <GlobeDemo />
//         </div>
//       </div>
//     </motion.section>
//   );
// };

// export default HomeContact;
