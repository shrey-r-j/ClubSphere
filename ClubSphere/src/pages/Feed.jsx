import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

// Club logo mapping
const clubLogos = {
  'PASC': ACM,
  'Art Circle': Art,
  'EDC': EDC,
  'Nakshatra': NAK,
  'NSS': NSS,
  'IEEE': IEEE,
  'PICTOREAL': PR,
  'CSI': CSI,
  'ROBOTICS': RRB,
  'ETHIC-CRAFT': EC,
  'AWS': AWS,
  'DEBSOC': DEB,
  'GDU': GDU
};

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto max-w-xl px-4 py-6">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            // Determine club logo, default to a placeholder if not found
            const clubLogo = clubLogos[post.clubName] || 'https://via.placeholder.com/150';

            return (
              <div 
                key={post._id} 
                className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Club Header */}
                <div className="flex items-center p-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
                    <img 
                      src={clubLogo} 
                      alt={post.clubName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-black">
                      {post.clubName || 'Unknown Club'}
                    </h4>
                  </div>
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="aspect-square w-full overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt="Post" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-3">
                  <p className="text-sm mb-2 text-gray-800">{post.caption}</p>
                  
                  <div className="flex justify-between items-center">
                    <small className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </small>
                    
                    {/* Interaction Icons */}
                    <div className="flex space-x-3">
                      <button className="text-gray-500 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-blue-500">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg> */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Feed;