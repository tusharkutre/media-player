import { useState, useRef, useEffect } from "react";
// import videos from "../utils/data.js";
import { useNavigate } from "react-router-dom";
import media from "../assets/media.png";

const VideoPlayer = () => {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(videos[0]); // Default to the first video

  // Helper function to set a cookie
  const setCookie = (name, value, days) => {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  // Helper function to get a cookie
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };

  useEffect(() => {
    // Load the saved playback time for the current video
    const savedTime = getCookie(`video_${currentVideo.id}_time`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, [currentVideo]);

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Save the current playback time in a cookie
      setCookie(
        `video_${currentVideo.id}_time`,
        videoRef.current.currentTime,
        7
      ); // Expires in 7 days
    }
  };

  // Handle video selection from the list
  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    if (videoRef.current) {
      videoRef.current.load(); // Reload the video player with the new source
    }
  };

  // Logout function
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <section className="h-screen p-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-2xl font-bold ">Media Player</h2>
          <img src={media} width={50} alt="Media" />
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-400/70 cursor-pointer text-white px-4 py-2 rounded-2xl"
        >
          Logout
        </button>
      </div>
      <h2 className="text-xl mb-6 font-semibold">
        Now playing {currentVideo.title}
      </h2>
      <div className="video-container flex flex-col justify-center mb-4">
        <video
          ref={videoRef}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          className="w-2xl rounded-2xl"
        >
          <source src={currentVideo.file} type="video/mp4" />
        </video>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">{currentVideo.title}</h3>
          <p className="text-sm text-gray-600">{currentVideo.description}</p>
        </div>
      </div>
      <div className="video-list grid lg:grid-cols-5 md:grid-cols-2 gap-3">
        {/* videos map code here */}
        {videos.map((video) => (
          <div
            key={video.id}
            className="videoDiv p-3 rounded-2xl cursor-pointer lg:w-fit bg-slate-200 hover:bg-gray-200"
            onClick={() => handleVideoSelect(video)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-auto rounded-md"
            />
            <h3 className="text-lg font-semibold">{video.title}</h3>
            <p className="text-sm text-gray-600">{video.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoPlayer;