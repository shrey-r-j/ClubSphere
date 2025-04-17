import React, { useEffect, useState, useRef } from "react";
import { ImagePlus, Upload, X, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

const ProfessionalUploader = () => {
  const [clubName, setClubName] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/clubheads/me", {
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

  const processFile = (file) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image type");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image must be smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          base64: reader.result.split(",")[1],
          contentType: file.type,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }

    const postData = {
      clubName: clubName,
      caption,
      image: image.base64,
      contentType: image.contentType,
    };

    try {
      await axios.post("http://localhost:3000/api/posts", postData);
      toast.success("Post created successfully");

      // Reset form
      setImage(null);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload post");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 mt-8 p-8 rounded-2xl shadow-xl border border-gray-200/60"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Post
        </h1>
        <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
          <Info size={16} className="text-blue-500" />
          For {clubName || "your club"} • Share your moment with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <div className="relative group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {image ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative overflow-hidden rounded-xl border-2 border-gray-200"
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-72 object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-medium">Click to change image</span>
                </div>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-red-100 transition-colors"
                >
                  <X className="text-gray-700 hover:text-red-600" size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl h-72 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 bg-gradient-to-br from-gray-50 to-gray-100/50 transition-all"
              >
                <div className="text-center space-y-4 p-6">
                  <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <ImagePlus className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Drag & drop your image here</p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse (16:9 ratio recommended)
                    </p>
                  </div>
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    Max 5MB • JPG, PNG, WEBP
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full px-5 py-4 border-0 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 h-40 resize-none text-gray-700 placeholder-gray-400 transition-all"
            maxLength={500}
          />
          <div className="flex justify-end mt-2">
            <span className="text-sm text-gray-400">{caption.length}/500 characters</span>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg active:shadow-inner transition-all font-semibold flex items-center justify-center gap-3"
        >
          <Upload size={20} className="shrink-0" />
          <span>Share Post</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ProfessionalUploader;