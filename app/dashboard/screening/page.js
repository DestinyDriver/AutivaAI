"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Camera,
  Video,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import ScreeningHero from "@/app/components/ScreeningHero";
import clsx from "clsx";

const steps = [
  {
    id: 1,
    title: "Selfie Capture",
    instruction:
      "Ensure good lighting. Face the camera directly and capture a clear selfie.",
  },
  {
    id: 2,
    title: "Video Recording",
    instruction:
      "Record a 10-second video. Keep the camera steady and your face clearly visible.\n\nNote: If you upload a video from your computer and its duration exceeds 10 seconds, only the first 10 seconds will be used.",
  },

  {
    id: 3,
    title: "EEG Upload",
    instruction:
      "Upload the EEG CSV file provided by the clinician or lab device. \n\nNote: Only .csv files are accepted. Please ensure the file is complete and unmodified.",
  },
];

export default function ScreeningPage() {
  const [currentStep, setCurrentStep] = useState(0);

  //photo
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const fileInputRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const isCompleted = currentStep > steps.length;

  //video
  const [videoStream, setVideoStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const videoInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(10);
  const recordingTimerRef = useRef(null);

  //eeg
  const [eegFile, setEegFile] = useState(null);
  const eegInputRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  //image

  async function openCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
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
      alert("Max 5MB allowed");
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

  //video

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

      if (blob.size > 50 * 1024 * 1024) {
        alert("Video must be under 50MB");
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

  //eeg
  function handleEEGUpload(file) {
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    setEegFile(file);
  }

  function handleVideoUpload(file) {
    if (!file) return;
    if (!file.type.startsWith("video/")) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Max 50MB allowed");
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
    <div className="flex min-h-[calc(100vh-4rem)] gap-6  ">
      {currentStep === 0 && (
        <>
          {/* <div>
            <Button
              className={
                "flex justify-center items-center bg-red-400 hover:bg-red-500"
              }
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
            >
              <LogOut className="size-4"></LogOut>
              Start Screening
            </Button>
          </div> */}

          <ScreeningHero setCurrentStep={setCurrentStep}></ScreeningHero>
        </>
      )}
      {currentStep >= 1 && (
        <>
          {/* LEFT PANEL */}
          <aside className="w-80 flex flex-col gap-6 pl-2 py-4">
            {/* Screenign Steps */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Screening Steps</h2>

              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                        step.id === currentStep && "bg-primary text-white",
                        step.id < currentStep && "bg-green-500/80 text-white",
                        step.id > currentStep &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {step.id}
                    </div>

                    <span
                      className={clsx(
                        "text-sm",
                        step.id === currentStep
                          ? "font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions Box */}
            {!isCompleted && (
              <Card className="p-4 text-sm bg-muted/40 border border-border text-muted-foreground whitespace-pre-line">
                <h3 className="font-medium text-foreground mb-1">
                  Instructions
                </h3>
                {steps[currentStep - 1].instruction}
              </Card>
            )}
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 pr-2 py-4">
            {!isCompleted ? (
              <Card className="h-full flex flex-col items-center justify-center gap-6">
                {currentStep === 1 && (
                  <>
                    {/* <div className="w-full h-full bg-emerald-400 grid grid-rows-3 grid-rows-[6fr_1fr_1fr]">
                  <div>
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <input type="file" accept="image/*"></input>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button onClick={() => setCurrentStep(2)}>
                      Upload Selfie
                    </Button>
                    <Button onClick={() => setCurrentStep(2)}>
                      Upload Selfie
                    </Button>
                  </div>
                </div> */}

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
                              Retake
                            </Button>
                          )}

                          {stream && (
                            <Button variant="outline" onClick={closeCamera}>
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
                              Upload Image
                            </Button>
                          </label>
                        </div>

                        <Button
                          onClick={() => setCurrentStep(2)}
                          disabled={!photoURL}
                        >
                          Next <ChevronRight className="size-5"></ChevronRight>
                        </Button>
                      </div>
                    </div>

                    {/* <Camera className="h-12 w-12 text-muted-foreground"/>
                <p className="text-lg font-medium">Capture and Upload Selfie</p>
                <Button onClick={() => setCurrentStep(2)}>Upload Selfie</Button> */}
                  </>
                )}

                {currentStep === 2 && (
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
                          <Button variant="outline" onClick={openVideoCamera}>
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
                          <Button variant="outline" onClick={startRecording}>
                            Record 10s
                          </Button>
                        )}

                        {/* RECORDING STATE */}
                        {isRecording && (
                          <>
                            <Button variant="destructive" disabled>
                              ● Recording {recordingTime}s
                            </Button>

                            <Button variant="outline" onClick={exitRecording}>
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
                            Retake
                          </Button>
                        )}

                        {/* CLOSE CAMERA */}
                        {videoStream && !isRecording && (
                          <Button variant="outline" onClick={stopVideoCamera}>
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
                          Upload Video
                        </Button>
                      </div>

                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!videoBlob}
                      >
                        Next <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* {currentStep === 2 && (
              <>
                <Video className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Record 10s Video</p>
                <Button onClick={() => setCurrentStep(3)}>Upload Video</Button>
              </>
            )} */}

                {currentStep === 3 && (
                  <div className="w-full h-full grid grid-rows-[6fr_1fr] gap-4 p-4">
                    {/* DROPBOX AREA (same as image/video preview box) */}
                    <div
                      onClick={() => eegInputRef.current?.click()}
                      className={clsx(
                        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition",
                        eegFile
                          ? "border-green-500 bg-green-500/5"
                          : "border-muted-foreground/40 hover:border-primary",
                      )}
                    >
                      <Upload className="size-10 text-muted-foreground mb-3" />

                      {eegFile ? (
                        <>
                          <p className="text-sm font-medium text-foreground">
                            {eegFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            File ready for submission
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium">
                            Click or drag EEG CSV file here
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Only .csv files are supported
                          </p>
                        </>
                      )}
                    </div>

                    {/* ACTION ROW (same alignment as others) */}
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center justify-start gap-x-2">
                        <Button
                          className={"flex justify-center items-center"}
                          onClick={() => {
                            setCurrentStep(currentStep - 1);
                          }}
                        >
                          <ChevronLeft className="size-4"></ChevronLeft>
                          Previous
                        </Button>

                        {eegFile && (
                          <Button
                            variant="outline"
                            onClick={() => setEegFile(null)}
                          >
                            Remove File
                          </Button>
                        )}
                      </div>

                      <Button
                        onClick={() => setCurrentStep(4)}
                        disabled={!eegFile}
                      >
                        Submit
                      </Button>
                    </div>

                    {/* HIDDEN INPUT */}
                    <input
                      ref={eegInputRef}
                      type="file"
                      accept=".csv"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleEEGUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                )}
              </Card>
            ) : (
              // FINAL RESULT VIEW
              <div className="h-full flex items-center justify-center">
                <h1 className="text-4xl font-bold tracking-wide">
                  RESULT IS HERE
                </h1>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
