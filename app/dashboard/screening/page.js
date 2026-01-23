"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Video } from "lucide-react";
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
      "Record a 10-second video. Keep the camera steady and face visible.",
  },
  {
    id: 3,
    title: "EEG Upload",
    instruction:
      "Upload the EEG CSV file provided by the clinician or lab device.",
  },
];

export default function ScreeningPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const isCompleted = currentStep > steps.length;

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* LEFT PANEL */}
      <aside className="w-80 flex flex-col gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Screening Steps</h2>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={clsx(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step.id === currentStep && "bg-primary text-white",
                    step.id < currentStep && "bg-green-500 text-white",
                    step.id > currentStep && "bg-muted text-muted-foreground",
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
          <Card className="p-4 text-sm text-muted-foreground">
            <h3 className="font-medium text-foreground mb-2">Instructions</h3>
            {steps[currentStep - 1].instruction}
          </Card>
        )}
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1">
        {!isCompleted ? (
          <Card className="h-full flex flex-col items-center justify-center gap-6">
            {currentStep === 1 && (
              <>
                <Camera className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Capture and Upload Selfie</p>
                <Button onClick={() => setCurrentStep(2)}>Upload Selfie</Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Video className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Record 10s Video</p>
                <Button onClick={() => setCurrentStep(3)}>Upload Video</Button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Upload EEG CSV File</p>
                <Button onClick={() => setCurrentStep(4)}>
                  Upload EEG File
                </Button>
              </>
            )}
          </Card>
        ) : (
          // FINAL RESULT VIEW
          <div className="h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold tracking-wide">RESULT IS HERE</h1>
          </div>
        )}
      </main>
    </div>
  );
}
