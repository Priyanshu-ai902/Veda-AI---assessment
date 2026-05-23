"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AssignmentPreview } from "@/components/assignment/assignment-preview";

function OutputContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [paper, setPaper] = useState<any>(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const assignmentRes = await fetch(`/api/assignments/${id}`);
        if (!assignmentRes.ok) throw new Error("Assignment not found");
        const assignment = await assignmentRes.json();

        if (assignment.status === 'completed') {
          const paperRes = await fetch(`/api/assignments/${id}/output`);
          if (!paperRes.ok) throw new Error("Paper not found");
          const paperData = await paperRes.json();
          setPaper(paperData);
          setStatus("completed");
        } else if (assignment.status === 'failed') {
          setStatus("failed");
          setError("Generation failed previously.");
        } else {
          // It's still processing. Since it's serverless, we might just poll a few times
          setStatus("processing");
          setTimeout(fetchResult, 3000); // Poll every 3 seconds just in case
        }
      } catch (err: any) {
        console.error(err);
        setStatus("failed");
        setError(err.message || "Failed to load generation result.");
      }
    };

    fetchResult();

  }, [id]);

  const handleDownload = async () => {
    if (!paper?._id) return;
    
    try {
      setIsDownloading(true);
      toast.info("Preparing your PDF...");
      
      const response = await fetch(`/api/assignments/pdf/${paper._id}`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assignment_${paper._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Download started!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!id) {
    return <div className="p-8">Invalid assignment ID.</div>;
  }

  if (error || status === "failed") {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold mb-2">Generation Failed</h2>
        <p>{error || "An unknown error occurred during generation."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  if (status !== "completed" || !paper) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Fetching your generation...</h2>
        <p className="text-muted-foreground">Please wait a moment while we retrieve the AI generated assignment.</p>
      </div>
    );
  }

  const generatedPaper = paper.generatedContent;

  return (
    <div className="px-4 md:px-8 py-6 relative">
      <div className="mx-auto max-w-4xl rounded-2xl bg-primary p-4 md:p-5 text-primary-foreground shadow-lg">
        <p className="text-xs md:text-sm leading-relaxed opacity-90">
          Certainly! Here is the customized Question Paper based on your instructions.
        </p>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold backdrop-blur hover:bg-white/20 disabled:opacity-50 transition-all border border-white/10"
        >
          {isDownloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )} 
          {isDownloading ? "Downloading..." : "Download as PDF"}
        </button>
      </div>

      <div className="mx-auto mt-6 max-w-4xl rounded-[2.5rem] border border-border/60 bg-card shadow-sm mb-20 md:mb-0 overflow-hidden" id="assignment-print-root">
        <AssignmentPreview generatedPaper={generatedPaper} />
      </div>

      <button className="fixed bottom-[100px] md:bottom-8 right-4 md:right-8 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-xl hover:opacity-90 active:scale-95 transition-all z-40 md:hidden">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}

export default function OutputPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <OutputContent />
    </Suspense>
  );
}
