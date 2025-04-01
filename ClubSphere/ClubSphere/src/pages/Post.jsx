import React, { useEffect, useState, useRef } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios"; // Ensure Axios is installed



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
          base64: reader.result.split(",")[1], // Extract Base64 string
          contentType: file.type, // Store MIME type
          preview: reader.result, // For displaying preview
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

    console.log(image);

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
    <div className="max-w-md mx-auto bg-white mt-10 p-8 rounded-2xl shadow-md border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Post</h1>
        <p className="text-gray-500 mt-2">Share your moment with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {image ? (
            <div className="relative">
              <img
                src={image.preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                <X className="text-gray-700" size={20} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <ImagePlus className="text-gray-400" size={48} />
              <p className="text-gray-500 mt-4">Click to upload image</p>
              <span className="text-xs text-gray-400">PNG, JPG, GIF (max 5MB)</span>
            </div>
          )}
        </div>

        {/* Caption Input */}
        <div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">{caption.length}/500 characters</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Upload size={20} />
          <span>Publish Post</span>
        </button>
      </form>
    </div>
  );
};

export default ProfessionalUploader;
