import React from "react";
import HomeHeader from "../header/HomeHeader";
import Link from "next/link";

const HomeBanner = () => {
  return (
    <section className="home-banner">
      {/* Vidéo de fond */}
      <div className="video-background">
        <video autoPlay loop muted className="video">
          <source src="assets/videos/banner-bg-video.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>
      </div>

      {/* Contenu principal */}
      <div className="mx-6 banner-content">
        {/* HomeHeader en haut, non affecté par le centrage */}
        <HomeHeader />

        {/* Contenu centré */}
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="righteous text-white title anim-title">
              Perfect Research
            </h1>
            <p className="text-white sub-title anim-sub-title">
              L’IA qui vous aide à rédiger vos thèses et vos mémoires
            </p>

            <br />
            <br />

            <div className="flex flex-row justify-around">
              <Link href={"pages/perfect/chat"}>
                <button className="btn btn-primary">Découvrir</button>
              </Link>

              <Link href={"pages/perfect/research"}>
                <button className="btn gb-grey">Chercher un document</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
