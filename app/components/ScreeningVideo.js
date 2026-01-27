"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  Upload,
  Camera,
  Video,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Eye,
  VideoOff,
  Circle,
  X,
  RotateCcw,
} from "lucide-react";

const ScreeningVideo = ({
  currentStep,
  setCurrentStep,
  setVideoBlob,
  setPhotoBlob,
  photoURL,
  videoURL,
  setPhotoURL,
  setVideoURL,
  setEegFile,
  photoBlob,
  videoBlob,
  eegFile,
}) => {
  const [videoStream, setVideoStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const videoInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(10);
  const recordingTimerRef = useRef(null);

  useEffect(() => {
    if (videoPreviewRef.current && videoStream) {
      videoPreviewRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  async function openVideoCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setVideoStream(mediaStream);
      videoPreviewRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Video camera denied", err);
    }
  }

  function stopVideoCamera() {
    if (videoStream) {
      videoStream.getTracks().forEach((t) => t.stop());
    }

    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }

    setVideoStream(null);
  }

  function startRecording() {
    if (!videoStream || isRecording) return;

    const recorder = new MediaRecorder(videoStream, {
      mimeType: "video/webm",
    });

    const chunks = [];
    setIsRecording(true);
    setRecordingTime(10);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      clearInterval(recordingTimerRef.current);
      const blob = new Blob(chunks, { type: "video/webm" });

      if (blob.size > 30 * 1024 * 1024) {
        toast.info("Image too large. Max size is 30MB");
        setIsRecording(false);
        return;
      }

      setVideoBlob(blob);
      setVideoURL(URL.createObjectURL(blob));
      setIsRecording(false);

      stopVideoCamera();
    };

    recorder.start();
    setMediaRecorder(recorder);

    // ⏱ AUTO STOP AFTER 10 SECONDS
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev <= 1) {
          recorder.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function exitRecording() {
    // 1. Stop recorder safely
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.ondataavailable = null;
      mediaRecorder.onstop = null;
      mediaRecorder.stop();
    }

    // 2. Kill any existing preview
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }

    // 3. Reset all video-related state
    setVideoBlob(null);
    setVideoURL(null);
    setIsRecording(false);
    setRecordingTime(10);

    // 4. Stop timer
    clearInterval(recordingTimerRef.current);

    // 5. Turn off camera
    // stopVideoCamera();
  }

  function handleVideoUpload(file) {
    if (!file) return;
    if (!file.type.startsWith("video/")) return;

    if (file.size > 30 * 1024 * 1024) {
      toast.info("Image too large. Max size is 30MB");
      return;
    }

    if (isRecording) return;

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.ondataavailable = null;
      mediaRecorder.onstop = null;
      mediaRecorder.stop();
    }

    clearInterval(recordingTimerRef.current);

    stopVideoCamera();

    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }

    setIsRecording(false);
    setRecordingTime(10);
    setVideoBlob(file);
    setVideoURL(URL.createObjectURL(file));
  }
  return (
    <div className="w-full h-full grid grid-rows-[6fr_1fr] gap-4 p-4">
      {/* VIDEO PREVIEW */}
      <div className="flex items-center justify-center rounded-lg border bg-black overflow-hidden">
        {videoURL ? (
          <video
            src={videoURL}
            controls
            className="w-full h-full object-cover"
          />
        ) : videoStream ? (
          <video
            ref={videoPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 ">
            <Video className="size-10 text-white" />
            <Button
              variant="outline"
              onClick={openVideoCamera}
              className={"flex justify-center items-center"}
            >
              Open Camera
            </Button>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {/* PREVIOUS BUTTON */}
          <Button
            className={"flex justify-center items-center"}
            onClick={() => {
              stopVideoCamera();
              setCurrentStep(currentStep - 1);
            }}
            disabled={isRecording}
          >
            <ChevronLeft className="size-4"></ChevronLeft>
            Previous
          </Button>

          {/* RECORD BUTTON */}
          {!videoURL && videoStream && !isRecording && (
            <Button
              variant="outline"
              onClick={startRecording}
              className={"flex items-center"}
            >
              <Circle className="size-4 "></Circle>
              Record 10s
            </Button>
          )}

          {/* RECORDING STATE */}
          {isRecording && (
            <>
              <Button variant="destructive" disabled>
                <span className="mb-[0.7px]">●</span> Recording {recordingTime}s
              </Button>

              <Button variant="outline" onClick={exitRecording}>
                <X className="size-4"></X>
                Exit Recording
              </Button>
            </>
          )}

          {/* RETAKE */}
          {videoURL && (
            <Button
              variant="outline"
              onClick={() => {
                URL.revokeObjectURL(videoURL);
                setVideoURL(null);
                setVideoBlob(null);
              }}
            >
              <RotateCcw className="size-4"></RotateCcw>
              Retake
            </Button>
          )}

          {/* CLOSE CAMERA */}
          {videoStream && !isRecording && (
            <Button variant="outline" onClick={stopVideoCamera}>
              <VideoOff className="size-4"></VideoOff>
              Close Camera
            </Button>
          )}

          {/* UPLOAD VIDEO */}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleVideoUpload(file);
              e.target.value = "";
            }}
          />

          <Button
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            disabled={isRecording || videoStream}
          >
            <Upload className="size-4"></Upload>
            Upload Video
          </Button>
        </div>

        <Button onClick={() => setCurrentStep(3)} disabled={!videoBlob}>
          Next <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default ScreeningVideo;
