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
  CameraOff,
  Aperture,
  RotateCcw,
} from "lucide-react";

const ScreeningImage = ({
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
  const fileInputRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  async function openCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      //   videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  }

  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
  }

  function capturePhoto() {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      if (blob.size > 5 * 1024 * 1024) {
        toast.info("Image too large. Max size is 5MB");
        return;
      }
      setPhotoBlob(blob);
      setPhotoURL(URL.createObjectURL(blob));
      console.log(blob);
    }, "image/jpeg");

    closeCamera();
  }

  function handleFileUpload(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.info("Image too large. Max size is 5MB");
      return;
    }

    // close camera if open
    closeCamera();

    // revoke old preview (memory safety)
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
    }

    setPhotoBlob(file);
    setPhotoURL(URL.createObjectURL(file));
  }

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <div className="w-full h-full  grid grid-rows-[6fr_1fr] gap-4 p-4">
        {/* CAMERA / PREVIEW AREA */}
        <div className="flex items-center justify-center rounded-lg border bg-black overflow-hidden">
          {photoURL ? (
            <img
              src={photoURL}
              alt="Captured selfie"
              className="w-full h-full object-cover"
            />
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center gap-y-4">
              <Camera className="size-10 text-white"></Camera>
              <Button variant="outline" onClick={openCamera}>
                Open Camera
              </Button>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-3">
            <Button
              className={
                "flex justify-center items-center bg-red-400 hover:bg-red-500"
              }
              onClick={() => {
                URL.revokeObjectURL(photoURL);
                URL.revokeObjectURL(videoURL);
                setPhotoBlob(null);
                setPhotoURL(null);
                setVideoBlob(null);
                setVideoURL(null);
                setEegFile(null);
                closeCamera();
                setCurrentStep(currentStep - 1);
              }}
            >
              <LogOut className="size-4"></LogOut>
              Exit
            </Button>

            {!photoURL && (
              <Button
                variant="outline"
                onClick={capturePhoto}
                disabled={!stream}
              >
                <Aperture className="h-4 w-4" />
                Capture
              </Button>
            )}

            {photoURL && (
              <Button
                variant="outline"
                onClick={() => {
                  URL.revokeObjectURL(photoURL);
                  // openCamera();
                  setPhotoURL(null);
                  setPhotoBlob(null);
                }}
              >
                <RotateCcw className="size-4"></RotateCcw>
                Retake
              </Button>
            )}

            {stream && (
              <Button variant="outline" onClick={closeCamera}>
                <CameraOff className="size-4"></CameraOff>
                Close Camera
              </Button>
            )}

            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);

                  // allow selecting same file again
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="size-4"></Upload>
                Upload Image
              </Button>
            </label>
          </div>

          <Button onClick={() => setCurrentStep(2)} disabled={!photoURL}>
            Next <ChevronRight className="size-5"></ChevronRight>
          </Button>
        </div>
      </div>
    </>
  );
};

export default ScreeningImage;
