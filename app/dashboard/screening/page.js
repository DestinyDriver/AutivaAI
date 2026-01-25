"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import clsx from "clsx";
import { CheckCircle2, XCircle, Loader2, RefreshCcw } from "lucide-react";
import ScreeningHero from "@/app/components/ScreeningHero";
import ScreeningImage from "@/app/components/ScreeningImage";
import ScreeningVideo from "@/app/components/ScreeningVideo";
import ScreeningEeg from "@/app/components/ScreeningEeg";

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
  const isCompleted = currentStep > steps.length;

  //photo
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  //video
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  //eeg
  const [eegFile, setEegFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState({
    getCount: "idle", // idle | loading | success | error
    video: "idle",
    image: "idle",
    eeg: "idle",
  });
  const [errorStep, setErrorStep] = useState(null); // "getCount" | "video" | "image" | "eeg"

  function StatusIcon({ status }) {
    if (status === "loading")
      return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status === "success")
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />;
    return (
      <div className="h-4 w-4 rounded-full border border-muted-foreground/40" />
    );
  }

  const screeningProps = {
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
  };

  const userId = "0a5e7cfa-3a3a-4f4b-b3dc-f5e8a1717423";

  const [recordCount, setRecordCount] = useState(100);

  async function uploadFile(url, file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (url === "/api/upload/video") {
        setProgress((p) => ({ ...p, video: "error" }));
        setErrorStep("video");
      } else if (url === "/api/upload/eeg") {
        setProgress((p) => ({ ...p, eeg: "error" }));
        setErrorStep("eeg");
      } else {
        setProgress((p) => ({ ...p, image: "error" }));
        setErrorStep("image");
      }
      throw new Error(data.error || `Upload Failed at ${url}`);
    }

    if (url === "/api/upload/video") {
      setProgress((p) => ({ ...p, video: "success" }));
      // setErrorStep("video");
    } else if (url === "/api/upload/eeg") {
      setProgress((p) => ({ ...p, eeg: "error" }));
      setErrorStep("eeg");
    } else {
      setProgress((p) => ({ ...p, image: "success" }));
      // setErrorStep("image");
    }

    return data.key;
  }

  async function fetchResult() {
    try {
      if (!photoBlob || !videoBlob || !eegFile) {
        toast.error("First upload all required files");
        return;
      }
      setCurrentStep(4);

      setLoading(true);
      setErrorStep(null);
      setProgress({
        getCount: "loading",
        video: "idle",
        image: "idle",
        eeg: "idle",
      });
      const res = await fetch(`/api/get-count?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setProgress((p) => ({ ...p, getCount: "error" }));
        setErrorStep("getCount");
        throw new Error(data?.error || "Get count failed");
      }

      setRecordCount(data.count);
      setProgress((p) => ({ ...p, getCount: "success" }));

      setProgress((p) => ({ ...p, video: "loading" }));
      const videoKey = await uploadFile("/api/upload/video", videoBlob);
      setProgress((p) => ({ ...p, video: "success" }));
      alert(videoKey);

      setProgress((p) => ({ ...p, image: "loading" }));
      const imageKey = await uploadFile("/api/upload/image", photoBlob);
      setProgress((p) => ({ ...p, image: "success" }));
      alert(imageKey);

      setProgress((p) => ({ ...p, eeg: "loading" }));
      const eegKey = await uploadFile("/api/upload/eeg", eegFile);
      setProgress((p) => ({ ...p, eeg: "success" }));
      alert(eegKey);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(`${err.message}`);
      toast.error("Something went Wrong.");
      console.error("Error at /get-count :", err.message);
      return;
    }
  }

  const eegProps = { fetchResult, ...screeningProps };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] gap-6  ">
      {/* Hero Page */}
      {currentStep === 0 && (
        <ScreeningHero setCurrentStep={setCurrentStep}></ScreeningHero>
      )}
      {/* Steps */}
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
                {/* step-1 */}
                {currentStep === 1 && (
                  <ScreeningImage {...screeningProps}></ScreeningImage>
                )}
                {/* step-2 */}
                {currentStep === 2 && (
                  <ScreeningVideo {...screeningProps}></ScreeningVideo>
                )}

                {currentStep === 3 && (
                  <ScreeningEeg {...eegProps}></ScreeningEeg>
                )}
              </Card>
            ) : (
              <Card className="h-full w-full flex flex-col items-center justify-center gap-6 p-6">
                {loading || errorStep ? (
                  <>
                    {/* Loader */}
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        Uploading your screening files...
                      </p>
                    </div>

                    {/* Progress Box */}
                    <div className="w-full max-w-md rounded-xl border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Get Count</span>
                        <StatusIcon status={progress.getCount} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Upload Video</span>
                        <StatusIcon status={progress.video} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Upload Image</span>
                        <StatusIcon status={progress.image} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Upload EEG CSV</span>
                        <StatusIcon status={progress.eeg} />
                      </div>

                      {/* Retry Button (only if error happened) */}
                      {errorStep && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={fetchResult}
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Retry Failed Step
                        </Button>
                      )}
                    </div>

                    {errorStep && (
                      <Button
                        onClick={() => {
                          setCurrentStep(0);
                        }}
                      >
                        Retry
                      </Button>
                    )}
                  </>
                ) : (
                  // ✅ After finished show result card
                  <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-wide">
                      RESULT IS HERE {recordCount}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      (empty result card for now)
                    </p>
                  </div>
                )}
              </Card>
            )}
          </main>
        </>
      )}
    </div>
  );
}
