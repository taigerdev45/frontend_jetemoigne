"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  organizationName: z.string().min(2, "Nom de l'organisation requis"),
  contactName: z.string().min(2, "Nom du contact requis"),
  email: z.string().email("Email invalide"),
  type: z.enum(["entreprise", "eglise", "association", "autre"]),
  message: z.string().min(10, "Message requis"),
});

type FormData = z.infer<typeof formSchema>;

export function PartnershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "entreprise",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Partnership Data:", data);
    alert("Demande de partenariat envoyée !");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        Devenir Partenaire
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de l'Organisation</label>
          <input {...register("organizationName")} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ma Société / Mon Église" />
          {errors.organizationName && <p className="text-red-500 text-xs">{errors.organizationName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Personne à contacter</label>
            <input {...register("contactName")} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jean Dupont" />
            {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email professionnel</label>
            <input {...register("email")} type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="contact@organisation.com" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type d'organisation</label>
          <select {...register("type")} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="entreprise">Entreprise</option>
            <option value="eglise">Église</option>
            <option value="association">Association</option>
            <option value="autre">Autre</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <textarea {...register("message")} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Comment souhaitez-vous collaborer ?" />
          {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer la demande
        </button>
      </form>
    </div>
  );
}
