"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

const formSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  skills: z.string().min(10, "Veuillez décrire vos compétences"),
  availability: z.string().min(5, "Disponibilités requises"),
});

type FormData = z.infer<typeof formSchema>;

export function VolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.support.createVolunteer({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        skills: data.skills.split("\n").map(s => s.trim()).filter(Boolean),
        availability: data.availability,
      });
      alert("Merci de votre proposition ! Nous vous recontacterons bientôt.");
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi de votre candidature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        Rejoindre l&apos;équipe Bénévoles
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom Complet</label>
            <input {...register("fullName")} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jean Dupont" />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input {...register("email")} type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jean@example.com" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <input {...register("phone")} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="06 12 34 56 78" />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Compétences & Motivation</label>
          <textarea {...register("skills")} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Dites-nous en plus sur ce que vous aimeriez faire..." />
          {errors.skills && <p className="text-red-500 text-xs">{errors.skills.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Disponibilités</label>
          <input {...register("availability")} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Week-ends, Soirées..." />
          {errors.availability && <p className="text-red-500 text-xs">{errors.availability.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer ma candidature
        </button>
      </form>
    </div>
  );
}
