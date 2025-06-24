
import HomeBanner from "./components/home/banner/HomeBanner";
import HomeAfterBanner from "./components/home/after_banner/HomeAfterBanner";

import HomeFooter from "./components/home/footer/HomeFooter";
import { Toaster } from "sonner";
import Benefits from "./components/Benefits/Benefits";
import CTA from "./components/Cta/CTA";

export default function Home() {
  return (
    <div className="">
      <Toaster richColors position="top-right" />
      <HomeBanner />

      <div className="full-bg">
        <HomeAfterBanner />
        <Benefits />
        <CTA />


        <HomeFooter />

        <br />
      </div>
      <br />
    </div>
  );
}
