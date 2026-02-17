"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Check, ChevronRight, Upload, Video, Mic, FileText, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Validation Schemas ---
const step1Schema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  isAnonymous: z.boolean().default(false),
  // Optional placeholders for step 2 fields to satisfy TypeScript
  type: z.enum(["video", "audio", "text"]).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  file: z.any().optional(),
});

const step2Schema = z.object({
  // Optional placeholders for step 1 fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  
  type: z.enum(["video", "audio", "text"]),
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  content: z.string().optional(), // For text content
  file: z.any().optional(), // For video/audio file
});

// Combined schema for final submission
export const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  isAnonymous: z.boolean().default(false),
  type: z.enum(["video", "audio", "text"]),
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  content: z.string().optional(),
  file: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const TestimonyForm = () => {
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(step === 1 ? step1Schema : step2Schema) as any,
    defaultValues: {
      isAnonymous: false,
      type: "text",
    },
  });

  const watchType = useWatch({ control, name: "type" });
  const watchFile = useWatch({ control, name: "file" });

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: watchType === "video" 
      ? { "video/*": [] } 
      : { "audio/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setValue("file", file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
    },
  });

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form Data:", data);
    alert("Témoignage envoyé avec succès !");
    setIsSubmitting(false);
    // Reset or redirect
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Partagez votre histoire</h2>
          <span className="text-sm font-medium text-slate-500">Étape {step} sur 3</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <input
                    {...register("firstName")}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Jean"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <input
                    {...register("lastName")}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="Dupont"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="jean.dupont@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <input
                  type="checkbox"
                  {...register("isAnonymous")}
                  id="anon"
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="anon" className="text-sm text-slate-700 select-none cursor-pointer">
                  Je souhaite témoigner de manière anonyme (mon nom ne sera pas affiché publiquement)
                </label>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                 <label className="text-sm font-medium mb-2 block">Type de témoignage</label>
                 <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "text", icon: FileText, label: "Écrit" },
                      { id: "audio", icon: Mic, label: "Audio" },
                      { id: "video", icon: Video, label: "Vidéo" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setValue("type", type.id as "video" | "audio" | "text")}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          watchType === type.id 
                            ? "border-blue-600 bg-blue-50 text-blue-700" 
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                        )}
                      >
                         <type.icon className="w-6 h-6" />
                         <span className="font-medium text-sm">{type.label}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Titre de votre témoignage</label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ex: Comment la foi a changé ma vie..."
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
              </div>

              {watchType === "text" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Votre histoire</label>
                  <textarea
                    {...register("content")}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Racontez-nous votre expérience..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fichier {watchType === "video" ? "Vidéo" : "Audio"}</label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                      isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                    )}
                  >
                    <input {...getInputProps()} />
                    {watchFile ? (
                      <div className="flex items-center gap-2 text-green-600">
                         <Check className="w-6 h-6" />
                         <span className="font-medium truncate max-w-[200px]">{watchFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-slate-400 mb-4" />
                        <p className="text-sm text-slate-600 font-medium">
                          Glissez votre fichier ici ou cliquez pour parcourir
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          MP4, MOV, MP3, WAV (Max 50Mo)
                        </p>
                      </>
                    )}
                  </div>
                  {preview && watchType === "video" && (
                    <video src={preview} controls className="w-full mt-4 rounded-lg max-h-48 object-cover" />
                  )}
                  {preview && watchType === "audio" && (
                    <audio src={preview} controls className="w-full mt-4" />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Tout est prêt !</h3>
              <p className="text-slate-600">
                Merci de partager votre témoignage. Il sera soumis à modération avant publication.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-xl text-left text-sm text-blue-800 flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>
                   En soumettant ce formulaire, vous acceptez que votre témoignage soit diffusé sur JeTemoigne TV et ses réseaux partenaires.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Retour
            </button>
          ) : (
            <div /> // Spacer
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Envoyer mon témoignage
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
