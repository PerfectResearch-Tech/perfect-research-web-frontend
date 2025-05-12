import Image from "next/image";
import HomeBanner from "./components/home/banner/HomeBanner";
import HomeAfterBanner from "./components/home/after_banner/HomeAfterBanner";
import HomeContact from "./components/home/contact/HomeContact";
import HomeDonation from "./components/home/donation/HomeDonation";
import HomeFooter from "./components/home/footer/HomeFooter";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <HomeBanner />

      <div className="full-bg">
        <HomeAfterBanner />
       <HomeContact />
        <HomeDonation />
   <HomeFooter />
         
        
        
        <br />
      </div>
      <br />
   
    </div>
  );
}
