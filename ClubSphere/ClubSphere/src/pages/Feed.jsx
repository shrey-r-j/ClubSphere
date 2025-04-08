import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Clock } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

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

// Club logo mapping with Unsplash images
// const clubLogos = {
//   'PASC': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
//   'Art Circle': 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format&fit=crop&q=60',
//   'EDC': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60',
//   'Nakshatra': 'https://images.unsplash.com/photo-1532522750741-628fde798c73?w=800&auto=format&fit=crop&q=60',
//   'NSS': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=60',
//   'IEEE': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60',
//   'PICTOREAL': 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=800&auto=format&fit=crop&q=60',
//   'CSI': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
//   'ROBOTICS': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
//   'ETHIC-CRAFT': 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=800&auto=format&fit=crop&q=60',
//   'AWS': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
//   'DEBSOC': 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&auto=format&fit=crop&q=60',
//   'GDU': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=60'
// };

// Default club image for unknown clubs
const defaultClubImage = "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&auto=format&fit=crop&q=60";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/posts');
        const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100" data-theme={theme}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-base-200 rounded-2xl shadow-lg p-8">
            <img
              src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop&q=60"
              alt="No content"
              className="w-32 h-32 object-cover rounded-full mb-4 opacity-50"
            />
            <p className="text-center text-base-content font-medium">No posts available yet</p>
            <p className="text-sm text-base-content/70 mt-2">Check back later for updates</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-base-200 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Club Header */}
                <div className="flex items-center p-4 border-b border-base-300">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/10">
                    <img
                      src={clubLogos[post.clubName] || defaultClubImage}
                      alt={post.clubName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="font-semibold text-base-content">
                      {post.clubName || 'Unknown Club'}
                    </h4>
                    <div className="flex items-center text-xs text-base-content/70">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
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
                <div className="p-4">
                  <p className="text-base-content leading-relaxed whitespace-pre-wrap">
                    {post.caption}
                  </p>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300">
                    <button className="flex items-center space-x-2 text-base-content/70 hover:text-primary transition-colors duration-200">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">Like</span>
                    </button>
                    
                    <span className="text-xs text-base-content/60">
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

// export default App

export default App;