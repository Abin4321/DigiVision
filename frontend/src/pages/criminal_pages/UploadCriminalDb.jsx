import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Sidebar/Sidebar';
import supabase from '../../SupabaseClient'

const UploadCriminalDb = () => {
  const [loading, setLoading] = useState(false);  // Ensure `loading` state is initialized
const [status, setStatus] = useState('');

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [countdown, setCountdown] = useState(15);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setPhoto(file);
      });
  }, []);

  useEffect(() => {
    let timer;
    if (capturing && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setCountdown(15); // Reset countdown when recording stops
    }
    return () => clearInterval(timer);
  }, [capturing, countdown]);


  useEffect(() => {
    if (videoChunks.length > 0) {
      const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
      setVideo(new File([videoBlob], `video_${Date.now()}.webm`, { type: 'video/webm' }));
    }
  }, [videoChunks]);

  const startCapture = useCallback(() => {
    setCapturing(true);
    setVideoChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
  
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setVideoChunks((prev) => [...prev, event.data]);
      }
    };
  
    mediaRecorderRef.current.start();
  
    // Stop recording automatically after 15 seconds
    setTimeout(() => {
      stopCapture();
    }, 15000); // 15 seconds
  }, []);
  
  const stopCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, []);
  
// flask-adithya
  const addFace = async (videoUrl, name) => {
    fetch('http://localhost:5000/add_face', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: videoUrl, name: name }),
    }).catch((error) => console.error('Error sending data to Flask:', error));
  };

  const handleFileUpload = async () => {
    if (!name.trim()) {
      alert('Please enter a valid name!');
      return;
    }
  
    if (!photo || !video) {
      alert('Please select both a photo and a video!');
      return;
    }
  
    setLoading(true);
    setStatus('Uploading...');
  
    try {
      // Upload photo to 'criminal_photos' bucket
      const photoFileName = `${Date.now()}_${photo.name}`;
      const { data: photoData, error: photoError } = await supabase.storage
        .from('criminal_photos')
        .upload(photoFileName, photo);
  
      if (photoError) throw photoError;
  
      const photoUrl = supabase.storage
        .from('criminal_photos')
        .getPublicUrl(photoFileName).data.publicUrl;
  
      // Upload video to 'criminal_videos' bucket
      const videoFileName = `${Date.now()}_${video.name}`;
      const { data: videoData, error: videoError } = await supabase.storage
        .from('criminal_videos')
        .upload(videoFileName, video);
  
      if (videoError) throw videoError;
  
      const videoUrl = supabase.storage
        .from('criminal_videos')
        .getPublicUrl(videoFileName).data.publicUrl;
  
      // Insert data into 'criminal_db' table
      const { error: dbError } = await supabase
        .from('criminal_db')
        .insert([
          {
            name: name,
            photo_url: photoUrl,
            video_url: videoUrl,
          },
        ]);
  
      if (dbError) throw dbError;
  
      setStatus('Upload successful!');
      addFace(videoUrl, name);
    } catch (error) {
      console.error(error);
      setStatus('Error uploading data.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-black overflow-y-auto">
        <motion.div className="w-full max-w-lg mx-auto  bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center text-white mb-6">Upload Criminal Data</h1>
          <div className="space-y-6">
            <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-gray-800" required />
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 font-semibold text-md">Use Gallery</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={useWebcam} onChange={() => setUseWebcam(!useWebcam)} />
                <div className={`w-11 h-5 ${useWebcam ? 'bg-blue-500' : 'bg-gray-300'} rounded-full shadow-md transition-all duration-300 relative`}>
                  <div className={`absolute top-1 w-4 h-3 bg-white rounded-full shadow-lg transition-all duration-300 ${useWebcam ? 'left-6' : 'left-1'}`}></div>
                </div>
              </label>
              <span className="text-gray-400 font-semibold text-md">Use Webcam</span>
            </div>

            {useWebcam ? (
              <>
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-48 rounded-lg shadow" />
                <div className="flex space-x-3 mt-3">
                  <button onClick={capturePhoto} className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg">Capture Photo</button>
                  {capturing ? (
  <div className="w-1/2 bg-red-600 text-white py-2 px-4 rounded-lg text-center">
    Stopping in {countdown}s...
  </div>
) : (
  <button onClick={startCapture} className="w-1/2 bg-green-600 text-white py-2 px-4 rounded-lg">
    Start Recording
  </button>
)}

                </div>
                {photo && (
                  <div className="mt-4">
                    <h2 className="text-gray-400 font-semibold">Captured Photo:</h2>
                    <img src={URL.createObjectURL(photo)} alt="Captured" className="w-full h-48 rounded-lg shadow" />
                  </div>
                )}
                {video && (
                  <div className="mt-4">
                    <h2 className="text-gray-400 font-semibold">Recorded Video:</h2>
                    <video controls className="w-full h-48 rounded-lg shadow">
                      <source src={URL.createObjectURL(video)} type="video/webm" />
                    </video>
                  </div>
                )}
              </>
            ) : (

              <>
  <label className="text-white font-semibold mb-2 block">Upload Photo of the Criminal:</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={(e) => setPhoto(e.target.files[0])} 
    className="w-full px-4 py-2 border rounded-lg text-gray-600 mb-4"
    required 
  />

  <label className="text-white font-semibold mb-2 block">Upload Face Video:</label>
  <input 
    type="file" 
    accept="video/*" 
    onChange={(e) => setVideo(e.target.files[0])} 
    className="w-full px-4 py-2 border rounded-lg text-gray-600"
    required 
  />
</>


            )}
            <button 
            onClick={handleFileUpload} 
            disabled={loading} 
            className="w-full bg-black text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:bg-gray-700 "
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          
            <p className="text-center text-gray-500 mt-4">{status}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadCriminalDb;

