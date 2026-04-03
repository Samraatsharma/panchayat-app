"use client";

import { useState, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseComplaintVoice } from "@/lib/ai";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceTicketForm({ user }: { user: User }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + " " + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recog error", event);
      if (event.error === 'not-allowed') {
        alert("Microphone access is blocked! Mobile browsers require a secure HTTPS connection (or 'localhost') to use voice features.");
      }
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setTranscript("");
    setSuccess(false);
  };

  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);

    if (!transcript.trim()) return;

    setIsProcessing(true);
    let aiResult: any = null;
    try {
      aiResult = await parseComplaintVoice(transcript);
    } catch (error) {
      console.warn("AI parsing failed:", error);
    }
    
    // Quick local fallback logic
    const text = transcript.toLowerCase();
    let localCat = "";
    if (text.includes("lift") || text.includes("elevator")) localCat = "Maintenance";
    else if (text.includes("water") || text.includes("leak") || text.includes("plumber")) localCat = "Plumbing";
    else if (text.includes("light") || text.includes("electric")) localCat = "Electrical";

    const finalCategory = localCat || aiResult?.category || "Other";
    const finalIssue = aiResult?.issue || transcript.substring(0, 100);
    const finalPriority = aiResult?.priority || "Medium";

    try {
      await addDoc(collection(db, "complaints"), {
        userId: user.uid,
        userName: user.email || user.phoneNumber || "Unknown",
        text: transcript,
        category: finalCategory,
        issue: finalIssue,
        priority: finalPriority,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating ticket", error);
    }
    setIsProcessing(false);
    setTranscript("");
  };

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full py-8 text-primary">
        <Loader2 className="w-16 h-16 animate-spin mb-4" />
        <h3 className="text-xl font-bold">Processing your ticket...</h3>
        <p className="text-on-surface-variant text-sm">We are translating and organizing your complaint.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full py-8 text-secondary drop-shadow-md">
        <CheckCircle2 className="w-20 h-20 mb-4" />
        <h3 className="text-2xl font-bold">Ticket Submitted!</h3>
        <p className="text-on-surface-variant">The admins have been notified.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full py-8">
      <div className="relative flex items-center justify-center mt-12 mb-8">
        {/* Outer Pulse Rings */}
        <div className={`absolute w-64 h-64 md:w-80 md:h-80 bg-primary-fixed opacity-20 rounded-full ${isRecording ? 'animate-ping' : ''}`}></div>
        <div className={`absolute w-52 h-52 md:w-64 md:h-64 bg-primary-fixed-dim opacity-30 rounded-full ${isRecording ? 'animate-pulse' : ''}`}></div>
        
        {/* Main Voice Button */}
        <button 
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={isRecording ? stopRecording : undefined}
          className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center group transition-all duration-300 select-none ${
            isRecording 
              ? "bg-red-600 scale-95 shadow-[0_0_60px_10px_rgba(220,38,38,0.3)]" 
              : "bg-gradient-to-br from-primary to-primary-container voice-glow active:scale-90"
          }`}
        >
          <span className="material-symbols-outlined text-white text-7xl md:text-8xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isRecording ? "graphic_eq" : "mic"}
          </span>
        </button>
      </div>

      <div className="mt-8 text-center px-4">
        <h3 className={`font-extrabold text-2xl md:text-3xl tracking-tight mb-4 transition-colors ${isRecording ? 'text-red-500' : 'text-primary'}`}>
          {isRecording ? "Release to send..." : "Tap to Speak Your Complaint"}
        </h3>
        {transcript ? (
          <p className="text-on-surface text-lg font-medium bg-surface-container-low px-6 py-4 rounded-3xl inline-block max-w-[80vw]">
            "{transcript}"
          </p>
        ) : (
          <p className="text-on-surface-variant text-lg bg-surface-container-low px-6 py-2 rounded-full inline-block font-medium">
            "The corridor light is not working"
          </p>
        )}
      </div>
    </div>
  );
}
