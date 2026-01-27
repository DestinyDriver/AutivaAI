import { Button } from "@/components/ui/button";
import { CheckCircle2, SquareArrowOutUpRight, Undo2 } from "lucide-react";
import React, { useEffect } from "react";

const ProgressCard = ({ clearBlob }) => {
  useEffect(() => {
    clearBlob();
    // alert("Blob cleared");
  }, []);

  return (
    <div className="w-full max-w-xl text-center space-y-5">
      {/* Success Icon */}
      <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto" />

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-tight">
        Screening Completed
      </h1>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        Your screening data has been successfully submitted and processed. A
        clinical report has been generated based on the collected inputs.
      </p>

      {/* Report Card */}
      <div className="mt-4 rounded-xl border bg-muted/30 px-6 py-5 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Screening Reference ID
          </span>
          <span className="text-sm font-medium">#xa01</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Screening Status
          </span>
          <span className="text-sm font-medium text-green-600">Completed</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Report Availability
          </span>
          <span className="text-sm font-medium">Ready for review</span>
        </div>
      </div>

      {/* Primary Action */}
      <Button
        className="mt-4 h-11 px-8 text-sm font-medium"
        onClick={() => {
          // navigate to report page
        }}
      >
        <SquareArrowOutUpRight className="size-4"></SquareArrowOutUpRight>
        View Screening Report
      </Button>

      {/* Secondary Note */}
    </div>
  );
};

export default ProgressCard;
