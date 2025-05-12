import React from "react";
import HomeHeader from "../header/HomeHeader";
import Link from "next/link";

const HomeBanner = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Vidéo de fond */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover"
        >
          <source src="assets/videos/banner-bg-video.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>
      </div>

      {/* Contenu superposé */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header en haut */}
        <div className="flex-none">
          <HomeHeader />
        </div>

        {/* Contenu principal centré */}
        <div className="flex-grow flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl text-center space-y-8">
            <h1 className="text-5xl md:text-6xl black text-white animate-fade-in">
              Perfect Research
            </h1>
            
            <p className="regular md:text-2xl text-white opacity-90 animate-fade-in delay-100">
              L'IA qui vous aide à rédiger vos thèses et vos mémoires
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fade-in delay-200">
              <Link href="pages/perfect/chat">
                <button className="btn btn-primary px-8 py-3 text-lg">
                  Découvrir
                </button>
              </Link>
              
              <Link href="pages/perfect/research">
                <button className="btn btn-secondary px-8 py-3 text-lg">
                  Chercher un document
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
