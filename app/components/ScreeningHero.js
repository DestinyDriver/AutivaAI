import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Camera,
  Video,
  Upload,
  ChevronRight,
  ShieldCheck,
  FileText,
  HeartPulse,
  SquareArrowOutDownRight,
  SquareArrowOutUpRight,
} from "lucide-react";

const ScreeningHero = ({ setCurrentStep }) => {
  return (
    // <div className="w-full min-h-screen  bg-background   flex items-start justify-center px-4 py-6 sm:px-6 lg:px-10 2xl:px-16 ">
    <div className="w-full min-h-[calc(100vh-4rem)] h-auto bg-background flex items-start justify-center px-4 py-6 sm:px-6 lg:px-10 2xl:px-16">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] rounded-2xl ">
        <div className="grid  grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="flex  flex-col justify-between p-5 sm:p-8 lg:p-10 2xl:p-14">
            {/* TOP */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Autiva-AI• Assessment Portal
                </span>

                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border bg-muted/40 text-muted-foreground">
                  Intake
                </span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold tracking-tight leading-tight">
                Clinical Screening Intake
              </h1>

              <p className="mt-4 text-sm sm:text-base 2xl:text-lg text-muted-foreground leading-relaxed max-w-xl 2xl:max-w-2xl">
                This workflow helps generate a preliminary screening summary
                using structured inputs. Results are intended to support
                clinical review and early observation—not to replace medical
                diagnosis.
              </p>

              {/* VALUE CARDS */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 2xl:gap-4">
                {/* Preliminary Summary */}
                <Card className="p-4 2xl:p-5 bg-muted/20">
                  <div className="flex items-start gap-3">
                    {/* FULL CIRCLE ICON */}
                    <div className="h-10 w-10 2xl:h-12 2xl:w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <FileText className="size-4 2xl:size-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-sm 2xl:text-base font-semibold">
                        Preliminary Summary
                      </p>
                      <p className="text-xs 2xl:text-sm text-muted-foreground leading-relaxed mt-1">
                        Generates a structured output that can be stored,
                        reviewed, and compared over time.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Clinical Support */}
                <Card className="p-4 2xl:p-5 bg-muted/20">
                  <div className="flex items-start gap-3">
                    {/* FULL CIRCLE ICON */}
                    <div className="h-10 w-10 2xl:h-12 2xl:w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <HeartPulse className="size-4 2xl:size-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-sm 2xl:text-base font-semibold">
                        Clinical Support
                      </p>
                      <p className="text-xs 2xl:text-sm text-muted-foreground leading-relaxed mt-1">
                        Designed for screening and triage workflows with
                        clinician interpretation in mind.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* PRIVACY CARD */}
              <Card className="mt-6 p-4 2xl:p-5 border bg-background">
                <div className="flex items-start gap-3">
                  {/* FULL CIRCLE ICON */}
                  <div className="h-10 w-10 2xl:h-12 2xl:w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4 2xl:size-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm 2xl:text-base font-semibold text-foreground">
                      Privacy & Data Handling
                    </p>
                    <p className="text-xs 2xl:text-sm text-muted-foreground leading-relaxed mt-1">
                      Data is captured for screening purposes and should be
                      handled under clinical and institutional guidelines. Only
                      authorized staff should access reports.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full sm:w-auto">
                  <SquareArrowOutUpRight className="size-4"></SquareArrowOutUpRight>
                  Review Past Reports
                </Button>
              </Link>

              <Button
                className="w-full sm:w-auto"
                onClick={() => setCurrentStep(1)}
              >
                Begin Screening <ChevronRight className="size-5 ml-1" />
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="   p-5 sm:p-8 lg:p-10 2xl:p-14 flex items-start ">
            <div className="w-full grid gap-4 2xl:gap-5">
              {/* PROGRESS CARD */}
              <div className="rounded-2xl border bg-background p-5 2xl:p-6">
                <p className="text-sm 2xl:text-base font-semibold text-foreground">
                  Workflow Overview
                </p>

                <p className="text-xs 2xl:text-sm text-muted-foreground mt-1 leading-relaxed">
                  This intake typically completes within a couple of minutes and
                  is structured for consistent data capture.
                </p>

                <div className="mt-4 flex items-center justify-between text-xs 2xl:text-sm text-muted-foreground">
                  <span>Steps</span>
                  <span className="font-medium text-foreground">3</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs 2xl:text-sm text-muted-foreground">
                  <span>Estimated time</span>
                  <span className="font-medium text-foreground">
                    1–2 minutes
                  </span>
                </div>
              </div>

              {/* STEP CARDS */}
              <div className="rounded-2xl border bg-background p-5 2xl:p-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 2xl:size-12 rounded-xl bg-muted flex items-center justify-center">
                    <Camera className="size-5 2xl:size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm 2xl:text-base">
                      Selfie Capture
                    </p>
                    <p className="text-xs 2xl:text-sm text-muted-foreground">
                      Facial image capture
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-5 2xl:p-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 2xl:size-12 rounded-xl bg-muted flex items-center justify-center">
                    <Video className="size-5 2xl:size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm 2xl:text-base">
                      Video Sample
                    </p>
                    <p className="text-xs 2xl:text-sm text-muted-foreground">
                      Captures facial gestures and eye-blink metrics
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-5 2xl:p-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 2xl:size-12 rounded-xl bg-muted flex items-center justify-center">
                    <Upload className="size-5 2xl:size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm 2xl:text-base">
                      EEG Upload
                    </p>
                    <p className="text-xs 2xl:text-sm text-muted-foreground">
                      Structured signal file submission
                    </p>
                  </div>
                </div>
              </div>

              {/* DISCLAIMER */}
              <div className="rounded-2xl border bg-background p-5 2xl:p-6">
                <p className="text-sm 2xl:text-base font-semibold text-foreground">
                  Clinical Disclaimer
                </p>
                <p className="text-xs 2xl:text-sm text-muted-foreground mt-1 leading-relaxed">
                  This tool provides screening support and should not be used as
                  a standalone diagnosis. Final interpretation must be performed
                  by qualified clinical professionals.
                </p>
              </div>
            </div>
          </div>
          {/* END RIGHT */}
        </div>
      </div>
    </div>
  );
};

export default ScreeningHero;
