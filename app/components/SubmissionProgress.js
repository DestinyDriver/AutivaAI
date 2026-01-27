import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, RotateCcw, Undo2 } from "lucide-react";
import React from "react";

const SubmissionProgress = ({
  StatusIcon,
  fetchResult,
  progress,
  errorStep,
  setCurrentStep,
  clearBlob,
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-xl font-semibold tracking-tight">
          Screening In Progress
        </h2>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed text-center">
          Your screening data is being securely transmitted, validated, and
          processed by the AutivaAI platform. This may take a few moments.
        </p>
      </div>

      {/* Status Card */}
      <div className="w-full max-w-xl rounded-2xl border bg-background shadow-sm overflow-hidden">
        <div className="divide-y">
          {/* Step 1 */}
          <div className="flex items-start justify-between gap-6 px-6 py-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Retrieve Previous Screening Records
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                Fetching historical screening data associated with the patient
                to maintain clinical continuity during analysis.
              </p>
            </div>
            <StatusIcon status={progress.getCount} />
          </div>

          {/* Step 2 */}
          <div className="flex items-start justify-between gap-6 px-6 py-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">Video Data Upload</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                Facial motion video used for behavioral and movement-based
                signal extraction.
              </p>
            </div>
            <StatusIcon status={progress.video} />
          </div>

          {/* Step 3 */}
          <div className="flex items-start justify-between gap-6 px-6 py-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">Image Data Upload</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                High-resolution facial image for static feature analysis and
                reference validation.
              </p>
            </div>
            <StatusIcon status={progress.image} />
          </div>

          {/* Step 4 */}
          <div className="flex items-start justify-between gap-6 px-6 py-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">EEG Data Upload</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                Structured EEG signal data (CSV format) provided by clinical
                equipment.
              </p>
            </div>
            <StatusIcon status={progress.eeg} />
          </div>

          {/* Step 5 */}
          <div className="flex items-start justify-between gap-6 px-6 py-5 bg-muted/20">
            <div className="space-y-1">
              <p className="text-sm font-medium">Analysis & Processing</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                Executing the AutivaAI inference engine to process multimodal
                inputs and generate screening insights.
              </p>
            </div>
            {true ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary mt-1" />
            ) : (
              <div className="h-4 w-4 rounded-full border mt-1" />
            )}
          </div>
        </div>
      </div>

      {/* Error Actions */}
      {errorStep && (
        <div className="w-full max-w-xl space-y-3">
          <Button className="w-full" onClick={() => fetchResult(errorStep)}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry Failed Step
          </Button>

          <Button
            variant="ghost"
            className="w-full text-sm text-white hover:text-white bg-red-400 hover:bg-red-500"
            onClick={() => {
              clearBlob();
              setCurrentStep(0);
            }}
          >
            <RotateCcw className="size-4 mr-2"></RotateCcw>
            Restart Screening
          </Button>
        </div>
      )}

      {/* Footer Trust Note */}
      {!errorStep && (
        <p className="text-xs text-muted-foreground max-w-xl text-center">
          Data transmission and processing are encrypted and handled in
          accordance with clinical privacy and security standards.
        </p>
      )}
    </>
  );
};

export default SubmissionProgress;
