"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CreditCard, Upload, Check } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.number().min(1, "Le montant doit être supérieur à 1€"),
  customAmount: z.string().optional(),
  method: z.enum(["card", "paypal", "transfer"]),
  proof: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const PREDEFINED_AMOUNTS = [10, 20, 50, 100];

export function DonationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50,
      method: "card",
    },
  });

  const selectedAmount = watch("amount");
  const selectedMethod = watch("method");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setValue("proof", acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Donation Data:", data);
    alert("Merci pour votre don !");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        Faire un Don
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Montant du don</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PREDEFINED_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setValue("amount", amt)}
                className={cn(
                  "py-3 rounded-xl border font-semibold transition-all",
                  selectedAmount === amt
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                )}
              >
                {amt} €
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input
              type="number"
              placeholder="Montant libre (€)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => {
                 const val = parseFloat(e.target.value);
                 if (!isNaN(val)) setValue("amount", val);
              }}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Moyen de paiement</label>
          <div className="grid grid-cols-3 gap-3">
             {[
               { id: "card", label: "Carte Bancaire" },
               { id: "paypal", label: "PayPal" },
               { id: "transfer", label: "Virement" }
             ].map((m) => (
               <button
                 key={m.id}
                 type="button"
                 onClick={() => setValue("method", m.id as any)}
                 className={cn(
                    "py-3 px-2 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-1",
                    selectedMethod === m.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-700 dark:text-blue-300"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                 )}
               >
                 {m.label}
               </button>
             ))}
          </div>
        </div>

        {/* Proof Upload */}
        <div className="space-y-3">
            <label className="text-sm font-medium flex items-center justify-between">
                <span>Preuve de transaction (Capture d'écran)</span>
                <span className="text-xs text-slate-500 font-normal">Optionnel</span>
            </label>
            <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                  isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-700 hover:border-blue-400"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                    {acceptedFiles.length > 0 ? <Check className="w-6 h-6 text-green-500" /> : <Upload className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {acceptedFiles.length > 0 ? (
                        <span className="text-green-600 font-medium">{acceptedFiles[0].name}</span>
                    ) : (
                        <span>Glissez votre fichier ici ou cliquez pour parcourir</span>
                    )}
                  </div>
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <CreditCard className="w-5 h-5" />}
          Faire un don de {selectedAmount} €
        </button>
      </form>
    </div>
  );
}
