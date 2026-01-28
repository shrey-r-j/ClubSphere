import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Clock, MessageCircle, Share2 } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore.js';

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

const defaultClubImage = "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&auto=format&fit=crop&q=60";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore(state => state.theme);
  const [lkcnt,setlkcnt]=useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/posts');
        const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        // console.log(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postTime = new Date(date);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  function incrementCount(){
    setlkcnt(lkcnt+1);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-100 to-base-200" data-theme={theme}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-base-content/70 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-tr from-base-100 to-base-200" data-theme={theme}>
      {/* <header className="sticky top-0 bg-base-100/80 backdrop-blur-lg z-10 shadow-md py-4">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="text-3xl font-extrabold text-center text-primary drop-shadow-md tracking-wide">🎉 Club Feed</h1>
        </div>
      </header> */}
      
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 bg-base-200/70 backdrop-blur rounded-3xl shadow-lg p-8 border border-base-300/50">
            <img
              src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop&q=60"
              alt="No content"
              className="w-32 h-32 object-cover rounded-full mb-4 opacity-50 shadow-inner"
            />
            <p className="text-center text-base-content font-medium">No posts available yet</p>
            <p className="text-sm text-base-content/70 mt-2 text-center">Check back later for updates from your favorite clubs</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-base-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-base-300/30 transition-all duration-300 hover:scale-[1.01]"
              >
                {/* Club Header */}
                <div className="flex items-center p-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary shadow-md">
                    <img
                      src={clubLogos[post.clubName] || defaultClubImage}
                      alt={post.clubName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="font-bold text-base-content text-lg">{post.clubName || 'Unknown Club'}</h4>
                    <div className="flex items-center text-xs text-base-content/70">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(post.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative aspect-video w-full overflow-hidden bg-base-300">
                    <img
                      src={`data:${post.contentType};base64,${post.image}`}
                      alt="Post content"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="px-5 py-4">
                  <p className="text-base-content leading-relaxed whitespace-pre-wrap text-sm md:text-base font-medium">
                    {post.caption}
                  </p>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300">
                    <div className="flex space-x-4">
                      <button onClick={incrementCount} className="flex items-center space-x-1 text-base-content/70 hover:text-pink-500 transition-colors duration-200 group">
                        <Heart 
                        className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold">Like </span>
                      </button>
                    </div>
                    
                    <span className="text-xs text-base-content/60 font-medium tracking-tight">
                      {new Date(post.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// console.log(lkcnt);

export default App;