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
import SubmissionProgress from "@/app/components/SubmissionProgress";
import ProgressCard from "@/app/components/ProgressCard";

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
    analysis: "idle",
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

  const [recordCount, setRecordCount] = useState(-1);

  async function runGetCount() {
    setProgress((p) => ({ ...p, getCount: "loading" }));

    const res = await fetch(`/api/get-count?userId=${userId}`);
    const data = await res.json();

    if (!res.ok) {
      setProgress((p) => ({ ...p, getCount: "error" }));
      setErrorStep("getCount");
      throw new Error(data?.error || "Get count failed");
    }

    setRecordCount(data.count);
    setProgress((p) => ({ ...p, getCount: "success" }));
  }

  async function uploadFile(url, file) {
    try {
      const formData = new FormData();
      const filename =
        url.split("/")[3] === "video"
          ? "video.webm"
          : url.split("/")[3] === "image"
            ? "photo.png"
            : "eeg.csv";
      formData.append("file", file, filename);

      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setProgress((p) => ({ ...p, [url.split("/")[3]]: "error" }));
        setErrorStep(`${url.split("/")[3]}`);
        throw new Error(data.error || `Upload Failed at ${url}`);
      }
      return data.key;
    } catch (err) {
      setProgress((p) => ({ ...p, [url.split("/")[3]]: "error" }));
      setErrorStep(`${url.split("/")[3]}`);
      throw new Error(data.error || `Upload Failed at ${url}`);
    }
  }

  async function runVideoUpload() {
    setProgress((p) => ({ ...p, video: "loading" }));
    const key = await uploadFile("/api/upload/video", videoBlob);
    setProgress((p) => ({ ...p, video: "success" }));
    return key;
  }

  async function runImageUpload() {
    setProgress((p) => ({ ...p, image: "loading" }));
    const key = await uploadFile("/api/upload/image", photoBlob);
    setProgress((p) => ({ ...p, image: "success" }));
    return key;
  }

  async function runEegUpload() {
    setProgress((p) => ({ ...p, eeg: "loading" }));
    const key = await uploadFile("/api/upload/eeg", eegFile);
    setProgress((p) => ({ ...p, eeg: "success" }));
    return key;
  }

  async function fetchResult(startFrom = "getCount") {
    try {
      if (!photoBlob || !videoBlob || !eegFile) {
        toast.error("First upload all required files");
        return;
      }

      setCurrentStep(4);
      setLoading(true);
      setErrorStep(null);

      const stages = ["getCount", "video", "image", "eeg", "analysis"];
      const startIndex = stages.indexOf(startFrom);

      const keys = { video_key: null, image_key: null, eeg_key: null };

      for (let i = startIndex; i < stages.length; i++) {
        const stage = stages[i];

        if (stage === "getCount") await runGetCount();
        if (stage === "video") keys.video_key = await runVideoUpload();
        if (stage === "image") keys.image_key = await runImageUpload();
        if (stage === "eeg") keys.eeg_key = await runEegUpload();
        if (stage === "analysis") continue;
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong !!");
      console.error("Submission error:", err);
    }
  }

  function clearBlob() {
    if (photoURL) URL.revokeObjectURL(photoURL);
    if (videoURL) URL.revokeObjectURL(videoURL);
    setPhotoBlob(null);
    setVideoBlob(null);
    setEegFile(null);
    setPhotoURL(null);
    setVideoURL(null);
    setProgress({
      getCount: "idle",
      video: "idle",
      image: "idle",
      eeg: "idle",
      analysis: "idle",
    });
    setErrorStep(null);
    setLoading(false);
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
                  <SubmissionProgress
                    {...{
                      StatusIcon,
                      fetchResult,
                      progress,
                      errorStep,
                      setCurrentStep,
                      clearBlob,
                    }}
                  ></SubmissionProgress>
                ) : (
                  <ProgressCard {...{ clearBlob }}></ProgressCard>
                )}
              </Card>
            )}
          </main>
        </>
      )}
    </div>
  );
}
