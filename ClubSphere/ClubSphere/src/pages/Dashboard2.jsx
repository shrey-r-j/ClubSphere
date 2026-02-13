import React, { useEffect, useState } from "react";

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

const Dashboard2 = () => {
  const [posts, setPosts] = useState([]);
  const [clubName, setClubName] = useState("");

  useEffect(() => {
    const fetchClubDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://import.meta.env.VITE_BACKEND_URL:3000/api/clubheads/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClubName(response.data.clubName);
      } catch (error) {
        console.error("Error fetching club details:", error.response?.data?.message || error.message);
      }
    };

    fetchClubDetails();
  }, []);


  useEffect(() => {
    const fetchClubPosts = async () => {
      if (!clubName) return; 

      try {
        const res = await axios.get(`http://import.meta.env.VITE_BACKEND_URL:3000/api/posts/${clubName}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching club posts:", error);
      }
    };

    fetchClubPosts();
  }, [clubName]);


  return (
    <div className="container mx-auto max-w-xl px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-4">{clubName} Dashboard</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const clubLogo = clubLogos[post.clubName] || 'https://via.placeholder.com/150';
            return (
              <div key={post._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center p-3 border-b">
                  <img src={clubLogo} alt={post.clubName} className="w-10 h-10 rounded-full mr-3" />
                  <h4 className="font-semibold text-sm">{post.clubName}</h4>
                </div>
                {post.image && (
                  <img src={`data:${post.contentType};base64,${post.image}`} alt="Post" className="w-full" />
                )}
                <div className="p-3">
                  <p className="text-sm text-gray-800">{post.caption}</p>
                  <small className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard2;