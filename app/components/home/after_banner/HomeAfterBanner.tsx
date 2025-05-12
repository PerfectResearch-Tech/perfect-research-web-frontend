import Link from "next/link";
import React from "react";

const HomeAfterBanner = () => {
  return (
    <div className="bg-sky-500 py-20 px-4 sm:px-8 md:px-16 bg-[url('/file2.svg')]">
      <h1 className="text-white title text-center bold  ">Nos produits</h1>
      <p className="text-white ligth sub-title text-center">
        Nous développons les meilleurs produits du marcher, <br />
        veuillez les explorer.
      </p>

      <br />
      <br />

      <div className="card-container">
        <Link href={"/pages/perfect/chat"}>
          <div className="card">
            {/* Centrage horizontal de l'image */}
            <div className="flex justify-center">
              <img src="/assets/images/png/chat.png" alt="chat" className="" width={70} height={70} />
            </div>
            <br />

            <div className="flex flex-row justify-between ">
              <h3 className="text-white bold">Perfect Chat</h3>
              <img src="/assets/images/png/home-right-arrow.png" alt="arrow" />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, eos!
              </p>
            </div>

          </div>
        </Link>

        <Link href={"/pages/perfect/research"}>
          <div className="card">
            {/* Centrage horizontal de l'image */}
            <div className="flex justify-center">
              <img src="/assets/images/png/paper.png" alt="paper" className="" width={70} height={70} />
            </div>
            <br />
            <div className="flex flex-row justify-between">
              <h3 className="text-white bold">Perfect Research</h3>
              <img src="/assets/images/png/home-right-arrow.png" alt="arrow" />
            </div>
            <div>
              <p className="ligth text-lg text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.  Illo, eos!
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
