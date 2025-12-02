"use client";

import React, { useState, useEffect } from "react";
import { ScanLine, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { students } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ScanStatus = "idle" | "scanning" | "success" | "error";

export default function ScanPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scannedStudent, setScannedStudent] = useState<typeof students[0] | null>(null);
  const { toast } = useToast();

  const handleScan = () => {
    setStatus("scanning");
    setScannedStudent(null);

    setTimeout(() => {
      // Simulate a 50% chance of an error
      if (Math.random() > 0.5) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        setScannedStudent(randomStudent);
        setStatus("success");
        toast({
          title: "Attendance Recorded",
          description: `${randomStudent.name} has been marked as present.`,
        });
      } else {
        setStatus("error");
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Could not read barcode. Please try again.",
        });
      }
    }, 1500); // Simulate scanning time
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'success' || status === 'error') {
      timer = setTimeout(() => {
        setStatus('idle');
        setScannedStudent(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  const StatusDisplay = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center text-green-600 flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16" />
            <h3 className="text-xl font-semibold">Scan Successful</h3>
            {scannedStudent && (
              <div className="flex flex-col items-center gap-2">
                 <Avatar className="h-20 w-20">
                  <AvatarImage src={scannedStudent.avatarUrl} alt={scannedStudent.name} data-ai-hint={scannedStudent.avatarHint}/>
                  <AvatarFallback>{scannedStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium text-foreground">{scannedStudent.name}</p>
                <p className="text-sm text-muted-foreground">ID: {scannedStudent.id} | Class: {scannedStudent.class}</p>
              </div>
            )}
          </div>
        );
      case "error":
        return (
          <div className="text-center text-destructive flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16" />
            <h3 className="text-xl font-semibold">Invalid Barcode</h3>
            <p className="text-muted-foreground">Student not found or barcode unreadable.</p>
          </div>
        );
      case "scanning":
        return (
           <div className="text-center text-primary flex flex-col items-center gap-4">
            <ScanLine className="w-16 h-16 animate-pulse" />
            <h3 className="text-xl font-semibold">Scanning...</h3>
            <p className="text-muted-foreground">Please hold the barcode steady.</p>
          </div>
        );
      default: // idle
        return (
          <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
            <AlertTriangle className="w-16 h-16" />
            <h3 className="text-xl font-semibold text-foreground">Ready to Scan</h3>
            <p>Press the button below to start the camera.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Scan Student Barcode</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative w-full aspect-square max-w-sm overflow-hidden rounded-lg border-4 border-dashed bg-muted flex items-center justify-center">
            {status === "scanning" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/70 shadow-[0_0_10px_2px_hsl(var(--accent))] animate-[scan_2s_ease-in-out_infinite]" style={{animationName: 'scan'}}></div>
            )}
             <div className="p-4">
              <StatusDisplay />
            </div>
          </div>

          <Button
            onClick={handleScan}
            disabled={status === "scanning"}
            size="lg"
            className="w-full max-w-sm"
          >
            <ScanLine className="mr-2 h-5 w-5" />
            {status === 'scanning' ? 'Scanning...' : 'Start Scan'}
          </Button>
        </CardContent>
      </Card>
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}
