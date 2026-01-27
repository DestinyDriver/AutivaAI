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
  CircleCheck,
  Trash2,
} from "lucide-react";
import clsx from "clsx";

const ScreeningEeg = ({
  fetchResult,
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
  const eegInputRef = useRef(null);

  function handleEEGUpload(file) {
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.info("Image too large. Max size is 10MB");
      return;
    }

    setEegFile(file);
  }

  return (
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
            <Button variant="outline" onClick={() => setEegFile(null)}>
              <Trash2 className="size-4"></Trash2>
              Remove File
            </Button>
          )}
        </div>

        <Button
          onClick={() => {
            fetchResult();
          }}
          disabled={!eegFile}
        >
          Submit
          <ChevronRight className="size-4"></ChevronRight>
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
  );
};

export default ScreeningEeg;
