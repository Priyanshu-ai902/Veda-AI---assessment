"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Plus, Loader2 } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "sonner";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

import { AssignmentPreview } from "@/components/assignment/assignment-preview";

function OutputContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [paper, setPaper] = useState<any>(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const checkExisting = async () => {
      try {
        const { data: assignment } = await axios.get(`${API_URL}/assignments/${id}`);
        if (assignment.status === 'completed') {
          const { data: paperData } = await axios.get(`${API_URL}/assignments/${id}/output`);
          setPaper(paperData);
          setStatus("completed");
        } else if (assignment.status === 'failed') {
          setStatus("failed");
          setError("Generation failed previously.");
        } else {
          setStatus(assignment.status);
          setupSocket();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const setupSocket = () => {
      const socket = io(SOCKET_URL);
      
      socket.on("connect", () => {
        socket.emit("join_assignment", id);
      });

      socket.on("generation:progress", (data) => {
        setStatus(data.status);
        setProgress(data.progress);
        setMessage(data.message);
      });

      socket.on("generation:completed", async (data) => {
        setStatus("completed");
        setProgress(100);
        try {
          const { data: paperData } = await axios.get(`${API_URL}/assignments/${id}/output`);
          setPaper(paperData);
        } catch (err) {
          console.error("Failed to fetch generated paper after completion", err);
        }
      });

      socket.on("generation:failed", (data) => {
        setStatus("failed");
        setError(data.error || data.message);
      });

      return () => {
        socket.disconnect();
      };
    };

    checkExisting();

  }, [id]);

  const handleDownload = async () => {
    if (!paper?._id) return;
    
    try {
      setIsDownloading(true);
      toast.info("Preparing your PDF...");
      
      const downloadUrl = `${API_URL}/assignments/pdf/${paper._id}`;
      
      // Using axios to fetch as blob to ensure we handle errors correctly
      const response = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'blob',
      });

      // Create a link element, hide it, and click it to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assignment_${paper._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
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
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        <div className="w-full max-w-md bg-secondary rounded-full h-2.5 overflow-hidden">
          <div className="bg-brand h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
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
