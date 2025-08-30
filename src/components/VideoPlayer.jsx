import { useState, useRef, useEffect } from "react";
import videos from "../utils/data.js";
import { useNavigate } from "react-router-dom";
import media from "../assets/media.png";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const VideoPlayer = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(videos[0]); // Default to the first video

  // helper to build per-user playback storage key
  const playbackKey = (email, videoId) => `playback_${email}_${videoId}`;

  // restore playback time when video metadata is loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current || !currentUser) return;
    const key = playbackKey(currentUser.email, currentVideo.id);
    const t = localStorage.getItem(key);
    if (t) {
      videoRef.current.currentTime = parseFloat(t);
    }
  };

  // Handle video time updates: save playback time per user+video in localStorage
  const handleTimeUpdate = () => {
    if (!videoRef.current || !currentUser) return;
    const key = playbackKey(currentUser.email, currentVideo.id);
    localStorage.setItem(key, String(videoRef.current.currentTime));
  };

  // Handle video selection from the list
  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    if (videoRef.current) {
      videoRef.current.load(); // reload video source; time will be restored on metadata load
    }
  };

  // Logout function
  const handleLogout = () => {
    navigate("/login");
  };

  // Keyboard shortcuts: ArrowLeft (-5s) ArrowRight (+5s)
  useEffect(() => {
    const onKey = (e) => {
      if (!videoRef.current) return;
      // don't interfere when typing in inputs or editable elements
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

      // Space toggles play/pause
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
        handleTimeUpdate();
        return; 
      }

      if (e.key === "ArrowLeft") {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
        handleTimeUpdate();
      } else if (e.key === "ArrowRight") {
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration || Infinity,
          videoRef.current.currentTime + 5
        );
        handleTimeUpdate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
        Now playing {currentVideo.description || <Skeleton count={1}/>}
      </h2>
      <div className="video-container flex flex-col justify-center mb-4">
        <video
          ref={videoRef}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-2xl rounded-2xl"
        >
          <source src={currentVideo.file} type="video/mp4" />
        </video>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">{currentVideo.description}</h3>
          <p className="text-sm text-gray-600 mb-5">{currentVideo.channel}</p>
        </div>
      </div>
      <div className="video-list grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-3">
        {/* videos map code here */}
        {videos.map((video) => (
          <div
            key={video.id}
            className="videoDiv p-3 rounded-2xl cursor-pointer lg:w-fit bg-slate-200 hover:bg-gray-200"
            onClick={() => handleVideoSelect(video)}
          >
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-auto rounded-md"
              />
            ) : (
              <Skeleton height={120} className="w-full rounded-md" />
            )}

            <h3 className="text-md font-semibold">{video.description ?? <Skeleton />}</h3>
            <p className="text-sm text-gray-600">{video.channel ?? <Skeleton width={100} />}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoPlayer;
