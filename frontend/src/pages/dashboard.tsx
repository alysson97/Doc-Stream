'use client';

import React from "react"

import { useState, useRef, useCallback, type DragEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { uploadPdf, type PdfUploadResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Upload,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadResult {
  status: UploadStatus;
  data?: PdfUploadResponse;
  error?: string;
  fileName?: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult>({
    status: "idle",
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") {
        setUploadResult({
          status: "error",
          error: "Apenas arquivos PDF sao permitidos.",
        });
        return;
      }
      setSelectedFile(file);
      setUploadResult({ status: "idle" });
    },
    []
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploadResult({ status: "uploading" });

    try {
      const data = await uploadPdf(selectedFile);
      setUploadResult({
        status: "success",
        data,
        fileName: selectedFile.name,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setUploadResult({
        status: "error",
        error:
          err instanceof Error ? err.message : "Falha ao enviar o arquivo.",
      });
    }
  }, [selectedFile]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setUploadResult({ status: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              DocFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Enviar documento
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione um arquivo PDF para processamento
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload de PDF</CardTitle>
            <CardDescription>
              Arraste e solte ou clique para selecionar um arquivo PDF
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {/* Drop zone */}
            <div
              className={cn(
                "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Selecionar arquivo PDF"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Clique para selecionar
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  ou arraste e solte aqui
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas PDF
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="sr-only"
                onChange={handleInputChange}
                aria-hidden="true"
              />
            </div>

            {/* Selected file */}
            {selectedFile && (
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remover arquivo</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Upload button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadResult.status === "uploading"}
              size="lg"
              className="w-full"
            >
              {uploadResult.status === "uploading" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload />
                  Enviar PDF
                </>
              )}
            </Button>

            {/* Result messages */}
            {uploadResult.status === "success" && uploadResult.data && (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Arquivo enviado com sucesso
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    {`Job ID: ${uploadResult.data.jobId} | Status: ${uploadResult.data.status}`}
                  </p>
                  {uploadResult.fileName && (
                    <p className="mt-0.5 text-xs text-green-600">
                      {uploadResult.fileName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {uploadResult.status === "error" && uploadResult.error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Erro no envio
                  </p>
                  <p className="mt-1 text-xs text-destructive/80">
                    {uploadResult.error}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
