import React, { useState } from 'react';
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

const Clubs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technical', 'Cultural', 'Professional'];

  const clubsData = [
    {
      id: 1,
      name: 'PASC',
      description: 'PICT ACM Student Chapter(PASC) consists of highly motivated students, ready to learn and help each other. PASC began in 2011, with the perspective of fostering technical and non-technical qualities.',
      image: ACM,
      category: 'Technical'
    },
    {
      id: 2,
      name: 'Art Circle',
      description: 'Art Circle is a dynamic community where creativity knows no bounds. From painting and poetry to music and dance, this club brings together talented individuals excelling in various art forms.',
      image: Art,
      category: 'Cultural'
    },
    {
      id: 3,
      name: 'EDC',
      description: 'Entrepreneurship Development Cell has been endowed to train and motivate the engineering students to become \'job creators\' rather than \'job seekers\'. It aims to cultivate the entrepreneurial spirit among students.',
      image: EDC,
      category: 'Professional'
    },
    {
      id: 4,
      name: "Nakshatra",
      description: "The Astronomy Club of PICT. We are a community of astronomy enthusiasts dedicated to exploring the wonders of the universe.",
      image: NAK,
      category: 'Cultural'
    },
    {
      id: 5,
      name: "NSS",
      description: "National Service Scheme (NSS) is a student-centered program that complements education with social commitment.",
      image: NSS,
      category: 'Cultural'
    },
    {
      id: 6,
      name: "IEEE",
      description: "IEEE Student Branch promotes technical innovation and excellence among students.",
      image: IEEE,
      category: 'Technical'
    },
    {
      id: 7,
      name: "PICTOREAL",
      description: "PICTOREAL is PICT's official photography club, capturing moments and creating memories.",
      image: PR,
      category: 'Cultural'
    },
    {
      id: 8,
      name: "CSI",
      description: "Computer Society of India student chapter promotes professional development in computing.",
      image: CSI,
      category: 'Technical'
    },
    {
      id: 9,
      name: "ROBOTICS",
      description: "The Robotics Club fosters innovation in robotics and automation technology.",
      image: RRB,
      category: 'Cultural'
    },
    {
      id: 10,
      name: "ETHIC-CRAFT",
      description: "ETHIC-CRAFT promotes ethical hacking and cybersecurity awareness.",
      image: EC,
      category: 'Technical'
    },
    {
      id: 11,
      name: "AWS",
      description: "AWS Student Chapter helps students learn cloud computing and AWS services.",
      image: AWS,
      category: 'Technical'
    },
    {
      id: 12,
      name: "DEBSOC",
      description: "The Debating Society promotes public speaking and critical thinking skills.",
      image: DEB,
      category: 'Professional'
    },
    {
      id: 13,
      name: "GDU",
      description: "Game Development United focuses on game design and development.",
      image: GDU,
      category: 'Technical'
    }
  ];

  const filteredClubs = selectedCategory === 'All' 
    ? clubsData 
    : clubsData.filter(club => club.category === selectedCategory);

    return (
      <div className="min-h-screen bg-base-100 px-6 py-12"> {/* ✅ Use DaisyUI theme */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-base-content mb-8"> {/* ✅ Theme-aware text */}
            Student Clubs
          </h1>
    
          <div className="flex justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 text-lg ${
                  selectedCategory === category
                    ? "bg-primary text-primary-content shadow-lg" /* ✅ Theme colors */
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="group relative bg-base-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden bg-base-300">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
    
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-base-content">{club.name}</h2>
                    <span className="px-4 py-1.5 text-sm bg-primary text-primary-content rounded-full">
                      {club.category}
                    </span>
                  </div>
    
                  <p className="text-base-content/70 mb-8 text-lg line-clamp-3">
                    {club.description || "Description coming soon..."}
                  </p>
    
                  <button className="w-full px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition-colors text-lg font-medium">
                    See Events
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    
};

export default Clubs;