"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Input, Textarea, Select, Card, Alert } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import contentService from "@/services/content.service";
import toast from "react-hot-toast";

const SUBJECTS = ["Mathematics", "Biology", "History", "Physics", "Chemistry", "English", "Geography", "Computer Science", "Art", "Physical Education"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  rotationDuration: z.coerce.number().min(5, "Min 5 seconds").max(300, "Max 300 seconds").optional(),
}).refine((d) => new Date(d.endTime) > new Date(d.startTime), {
  message: "End time must be after start time", path: ["endTime"],
});

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [serverError, setServerError] = useState("");
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rotationDuration: 30 },
  });

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFileError("");
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) { setFileError("Only JPG, PNG, GIF files are allowed."); return; }
    if (f.size > MAX_SIZE) { setFileError("File size must be under 10MB."); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const onSubmit = async (data) => {
    if (!file) { setFileError("Please select a file."); return; }
    setServerError("");
    try {
      const fd = new FormData();
      fd.append("teacherId", user.id);
      fd.append("teacherName", user.name);
      Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ""));
      fd.append("fileName", file.name);
      fd.append("fileType", file.type);
      fd.append("filePreviewUrl", preview || "");
      await contentService.uploadContent(fd);
      toast.success("Content uploaded successfully! Awaiting approval.");
      router.push("/teacher/my-content");
    } catch (err) {
      setServerError(err?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Upload Content</h1>
            <p className="text-gray-400 mt-1">Fill in the details and upload your educational content.</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Alert type="error" message={serverError} />

              <Input label="Title" placeholder="e.g. Introduction to Algebra" error={errors.title?.message} required {...register("title")} />

              <Select label="Subject" error={errors.subject?.message} required {...register("subject")}>
                <option value="">Select a subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>

              <Textarea label="Description" placeholder="Brief description of the content..." {...register("description")} />

              {/* File upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">File <span className="text-red-500">*</span></label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${fileError ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"}`}>
                  {preview ? (
                    <div className="space-y-2">
                      <img src={preview} alt="Preview" className="h-32 mx-auto object-cover rounded-lg" />
                      <p className="text-sm text-gray-600 font-medium">{file?.name}</p>
                      <p className="text-xs text-gray-400">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl opacity-30">📁</div>
                      <p className="text-sm text-gray-500 font-medium">Click to select a file</p>
                      <p className="text-xs text-gray-400">JPG, PNG, GIF — max 10MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handleFile} />
                {fileError && <p className="text-xs text-red-500">{fileError}</p>}
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Time" type="datetime-local" error={errors.startTime?.message} required {...register("startTime")} />
                <Input label="End Time" type="datetime-local" error={errors.endTime?.message} required {...register("endTime")} />
              </div>

              <Input label="Rotation Duration (seconds)" type="number" placeholder="30" error={errors.rotationDuration?.message} {...register("rotationDuration")} />

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={isSubmitting} size="lg" className="flex-1">
                  📤 Upload Content
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
