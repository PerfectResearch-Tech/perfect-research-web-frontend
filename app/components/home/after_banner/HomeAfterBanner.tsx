import Link from "next/link";
import React from "react";
import Image from "next/image"; // Ajout de l'import Image

const HomeAfterBanner = () => {
  return (
    <div className="bg-custom py-20 px-4 sm:px-8 md:px-16 bg-[url('/file2.svg')]">
      <h1 className="text-white title text-center bold">Nos offres</h1>
      <p className="text-white ligth sub-title text-center">
        Accompagner la recherche, stimuler l’innovation, valoriser la donnée
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo,
                eos!
              </p>
            </div>
          </div>
        </Link>

        <Link href={"/pages/perfect/research"}>
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
              <h3 className="text-white bold">Perfect Research</h3>
              <Image
                src="/assets/images/png/home-right-arrow.png"
                alt="arrow"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo,
                eos!
              </p>
            </div>
          </div>
        </Link>

        <Link href={"/pages/perfect/research"}>
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
              <h3 className="text-white bold">Perfect Research</h3>
              <Image
                src="/assets/images/png/home-right-arrow.png"
                alt="arrow"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo,
                eos!
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
