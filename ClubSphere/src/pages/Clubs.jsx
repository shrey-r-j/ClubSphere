import React from 'react';
import ACM from "../assets/ACM.jpg"
import Art from "../assets/ArtCircle.jpeg"
import EDC from "../assets/EDC.jpg"
import NAK from "../assets/Nak.jpeg"
import NSS from "../assets/NSS.jpg"
import EC from "../assets/EthiCraft.png"
import AWS from "../assets/AWS.jpeg"
import CSI from "../assets/CSI.jpg"
import PR from "../assets/PICTOREAL.jpg"
import RRB from "../assets/ROBOTICS.jpg"
import DEB from "../assets/DEBSOC.jpg"
import GDU from "../assets/GAMEDEV.jpg"
import IEEE from "../assets/IEEE.jpg"

 
const clubsData = [
  {
    id: 1,
    name: 'PASC',
    description: 'PICT ACM Student Chapter(PASC) consists of highly motivated students, ready to learn and help each other. PASC began in 2011, with the perspective of fostering technical and non-technical qualities. ',
    image: ACM,
  },
  {
    id: 2,
    name: 'Art Circle',
    description: 'Art Circle is a dynamic community where creativity knows no bounds. From painting and poetry to music and dance, this club brings together talented individuals excelling in various art forms.',
    image: Art,
  },
  {
    id: 3,
    name: 'EDC',
    description: 'Entrepreneurship Development Cell has been endowed to train and motivate the engineering students to become \'job creators\' rather than \'job seekers\'. It aims to cultivate the entrepreneurial spirit among students. ',
    image: EDC,
  },
  {
    id: 4,
    name: "Nakshatra",
    description: "The Astronomy Club of PICT. We are a community of astronomy enthusiasts dedicated to exploring the wonders of the universe.",
    image: NAK,
  },
  {
    id: 5,
    name: "NSS",
    description: "",
    image: NSS,
  },
  {
    id: 6,
    name: "IEEE",
    description: "",
    image: IEEE,
  },
  {
    id: 7,
    name: "PICTOREAL",
    description: "",
    image: PR,
  },
  {
    id: 8,
    name: "CSI",
    description: "",
    image: CSI,
  },
  {
    id: 9,
    name: "ROBOTICS",
    description: "",
    image: RRB,
  },
  {
    id: 10,
    name: "ETHIC-CRAFT",
    description: "",
    image: EC,
  },
  {
    id: 11,
    name: "AWS",
    description: "",
    image: AWS,
  },
  {
    id: 12,
    name: "DEBSOC",
    description: "",
    image: DEB,
  },
  {
    id: 13,
    name: "GDU",
    description: "",
    image: GDU,
  },
];

const Clubs = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">All Clubs</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {clubsData.map((club) => (
          <div
            key={club.id}
            className="bg-white shadow-lg rounded-xl p-5 text-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300"
          >
            <img
              src={club.image}
              alt={club.name}
              className="w-full h-40 object-contain rounded-md"
            />
            <h2 className="text-xl font-semibold mt-4 text-gray-900">{club.name}</h2>
            <p className="text-gray-600 mt-2">{club.description}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              See Upcoming Events
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};




export default Clubs;