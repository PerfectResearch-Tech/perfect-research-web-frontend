import React from "react";
import HomeHeader from "../header/HomeHeader";
import Link from "next/link";
import Image from "next/image";
import { BackgroundLines } from "@/app/components/ui/background-lines";

const HomeBanner = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Ici on met BackgroundLines en fond */}
      <BackgroundLines className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_5px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      {/* Voile dégradé en bas */}
      <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.9)] to-[rgba(202,208,230,0.9)]"></div>

      {/* Contenu superposé */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-none">
          <HomeHeader />
        </div>

        <div className="flex-grow flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl text-center space-y-8 ">
            <h1 className="text-6xl md:text-9xl black text-black animate-fade-in">
              Perfect Research
            </h1>

            <p className="regular md:text-4xl text-black opacity-90 typewriter">
              L'IA qui vous aide à rédiger vos thèses et vos mémoires
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fade-in delay-200">
              <Link href="pages/perfect/chat">
                <button className="btn btn-primary text-lg uppercase">
                  Débuter maintenant
                </button>
              </Link>

              <Link href="pages/perfect/research">
                <button className="btn btn-secondary text-lg uppercase">
                  Chercher un document
                </button>
              </Link>
            </div>

            <div className="flex justify-center mt-10 animate-fade-in delay-300">
              <Image
                src="/assets/images/png/hero-mockup.webp"
                alt="Logo"
                width={384}
                height={384}
                quality={100}
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
