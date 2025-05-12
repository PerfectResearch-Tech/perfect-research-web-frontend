import React from "react";
import { MapPin, Phone, Send, Globe } from "lucide-react";

const HomeContact = () => {
  return (
    <section id="contact-section" className="py-16 bg-white bg-[url('/file2.svg')]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl bold text-black uppercase tracking-widest">Contact</h1>
          {/* <h2 className="text-3xl font-semibold mb-4">Contact Me</h2> */}
          <p className="text-black max-w-xl mx-auto regular">
Vous avez une question, une idée ou simplement envie d’échanger ? Retrouvez-nous via les coordonnées ci-dessous. Nous sommes toujours ravis de discuter avec vous !
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-sky-600 text-center p-6 shadow-lg shadow-cyan-500/50 rounded-2xl transform transition duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg">
            <div className="flex justify-center items-center mb-4 text-white text-3xl">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl ligth text-white mb-2">Address</h3>
            <p className="text-white">Lomé, Togo</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-sky-600 text-center p-6 shadow-lg shadow-cyan-500/50 rounded-2xl transform transition duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg">
            <div className="flex justify-center items-center mb-4 text-white text-3xl">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl ligth text-white mb-2">Contact Number</h3>
            <p><a href="tel://0022892033531" className="text-white hover">00228 92 03 35 31</a></p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-sky-600 text-center p-6 shadow-lg shadow-cyan-500/50 rounded-2xl transform transition duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg">
            <div className="flex justify-center items-center mb-4 text-white text-3xl">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl ligth mb-2 text-white">Email Address</h3>
            <p><a href="mailto:contact@justeinnover.com" className="text-white hover">contact@justeinnover.com</a></p>
          </div>

          {/* Card 4 */}
          <div className="bg-sky-600 text-center p-6 shadow-lg shadow-cyan-500/50 rounded-2xl transform transition duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg">
            <div className="flex justify-center items-center mb-4 text-white text-3xl">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl ligth mb-2 text-white">Website</h3>
            <p><a href="https://tech-ateliers.com/author/supportjusteinnover-com/" className="text-white hover">www.justeinnover.com</a></p>
          </div>
        </div>

        {/* Contact Form and Image */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <form className="bg-gray-100 p-6 rounded-2xl shadow-lg space-y-4 transform transition duration-500 hover:scale-105">
            <input type="text" placeholder="Your Name" className="w-full p-3 rounded-md border border-gray-300" />
            <input type="email" placeholder="Your Email" className="w-full p-3 rounded-md border border-gray-300" />
            <input type="text" placeholder="Subject" className="w-full p-3 rounded-md border border-gray-300" />
            <textarea placeholder="Message" rows="5" className="w-full p-3 rounded-md border border-gray-300"></textarea>
            <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition">Send Message</button>
          </form>
          <div className="w-full h-96 bg-cover bg-center rounded-2xl shadow-lg" style={{ backgroundImage: "url('/images/PORTFOLIO .jpg')" }}></div>
        </div> */}
      </div>
    </section>
  );
};

export default HomeContact;


