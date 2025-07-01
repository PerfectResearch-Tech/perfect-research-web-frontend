import Link from "next/link";
import React from "react";
import Image from "next/image"; // Ajout de l'import Image

const HomeAfterBanner = () => {
  return (
    <div className="bg-custom py-20 px-4 sm:px-8 md:px-16 bg-[url('/file2.svg')]">
      <h1 className="text-white title text-center bold">
        {" "}
        On change la donne!
      </h1>
      <p className="text-white ligth sub-title text-center">
        Nous démocratisons l'accès à la connaissance et à l’exploitation des
        données en Afrique grâce à trois solutions innovantes
        <br />
      </p>

      <br />
      <br />

      <div className="card-container">
        <Link href={"/pages/perfect/chat"}>
          <div className="card">
            <div className="flex justify-center">
              <Image
                src="/assets/images/png/chat.png"
                alt="chat"
                width={70}
                height={70}
              />
            </div>
            <br />
            <div className="flex flex-row justify-between">
              <h3 className="text-white bold">Perfect Chat</h3>
              <Image
                src="/assets/images/png/home-right-arrow.png"
                alt="arrow"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Un assistant intelligent, basé sur une technologie avancée d'IA,
                nourri par des milliers de travaux universitaires et
                scientifiques africains.
              </p>
            </div>
          </div>
        </Link>

        <Link href={""}>
          <div className="card">
            <div className="flex justify-center">
              <Image
                src="/assets/images/png/paper.png"
                alt="paper"
                width={70}
                height={70}
              />
            </div>
            <br />
            <div className="flex flex-row justify-between">
              <h3 className="text-white bold">PerfectChat Pro</h3>
              <Image
                src="/assets/images/png/home-right-arrow.png"
                alt="arrow"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Dédié aux entreprises, il leur permet d'extraire de la valeur de
                leurs propres données clients. Grâce à l’IA les entreprises
                optimisent leurs processus.
              </p>
            </div>
          </div>
        </Link>

        <Link href={""}>
          <div className="card">
            <div className="flex justify-center">
              <Image
                src="/assets/images/png/paper.png"
                alt="paper"
                width={70}
                height={70}
              />
            </div>
            <br />
            <div className="flex flex-row justify-between">
              <h3 className="text-white bold">PerfectChat API </h3>
              <Image
                src="/assets/images/png/home-right-arrow.png"
                alt="arrow"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Une plateforme flexible que les startups peuvent intégrer facilement à leurs applications pour analyser, exploiter et valoriser leurs propres données.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <br />
      <br />
      <br />
    </div>
  );
};

export default HomeAfterBanner;
