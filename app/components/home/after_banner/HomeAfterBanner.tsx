import Link from "next/link";
import React from "react";

const HomeAfterBanner = () => {
  return (
    <div className="after-banner py-20 px-4 sm:px-8 md:px-16">
      <h1 className="warrior text-white title">Nos produits</h1>
      <p className="text-white righteous sub-title">
        Nous développons les meilleurs produits du marcher, <br />
        veuillez les explorer.
      </p>

      <br />
      <br />

      <div className="card-container">
        <Link href={"/pages/perfect/chat"}>
          <div className="card">
            <img src="/assets/images/png/chat.png" alt="chat" className="" />
            <br />
            <div className="flex flex-row justify-between">
              <h3 className="text-white righteous">Perfect Chat</h3>
              <img src="/assets/images/png/home-right-arrow.png" alt="arrow" />
            </div>
          </div>
        </Link>

        <Link href={"/pages/perfect/research"}>
          <div className="card">
            <img src="/assets/images/png/paper.png" alt="paper" className="" />
            <br />
            <div className="flex flex-row justify-between">
              <h3 className="text-white righteous">Perfect Research</h3>
              <img src="/assets/images/png/home-right-arrow.png" alt="arrow" />
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
