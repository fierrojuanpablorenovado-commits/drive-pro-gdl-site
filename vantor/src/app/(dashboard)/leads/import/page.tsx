"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileSpreadsheet, Check, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { importLeads } from "@/server/actions/import";

interface ParsedRow {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  source?: string;
  interest?: string;
}

const EXPECTED_HEADERS = ["name", "nombre", "phone", "telefono", "teléfono", "email", "correo", "company", "empresa", "source", "fuente", "interest", "interés", "interes"];

const headerMap: Record<string, string> = {
  nombre: "name",
  name: "name",
  telefono: "phone",
  teléfono: "phone",
  phone: "phone",
  tel: "phone",
  celular: "phone",
  correo: "email",
  email: "email",
  "e-mail": "email",
  empresa: "company",
  company: "company",
  compañía: "company",
  fuente: "source",
  source: "source",
  origen: "source",
  canal: "source",
  interés: "interest",
  interes: "interest",
  interest: "interest",
  producto: "interest",
  servicio: "interest",
};

export default function ImportLeadsPage() {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "preview" | "result">("upload");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  function parseCSV(text: string): ParsedRow[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const separator = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";
    const rawHeaders = lines[0].split(separator).map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

    const mappedHeaders = rawHeaders.map((h) => headerMap[h] || null);

    const parsed: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator).map((v) => v.trim().replace(/^['"]|['"]$/g, ""));
      const row: any = {};

      mappedHeaders.forEach((header, idx) => {
        if (header && values[idx]) {
          row[header] = values[idx];
        }
      });

      if (row.name) {
        parsed.push(row as ParsedRow);
      }
    }

    return parsed;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        setError("No se encontraron datos válidos. Asegúrate de que la primera fila tiene encabezados (nombre, teléfono, email, etc.)");
        return;
      }

      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImport() {
    setLoading(true);
    setError("");

    const res = await importLeads({ rows });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setResult(res);
    setStep("result");
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/leads" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importar leads</h1>
          <p className="text-sm text-gray-500 mt-1">Sube un archivo CSV o Excel exportado como CSV</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-danger-50 text-danger-600 text-sm flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="max-w-xl mx-auto">
          <label className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-400 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-700">Arrastra un archivo o haz clic para seleccionar</p>
            <p className="text-xs text-gray-400 mt-1">CSV, máximo 1,000 filas</p>
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="mt-6 bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Formato esperado</h3>
            <p className="text-xs text-gray-500 mb-3">
              La primera fila debe tener los encabezados. Aceptamos estos nombres (en español o inglés):
            </p>
            <div className="bg-white rounded-lg p-3 font-mono text-xs text-gray-600 overflow-x-auto">
              nombre,telefono,email,empresa,fuente,interes<br />
              Juan Pérez,33 1234 5678,juan@email.com,Mi Empresa,WhatsApp,Departamento en Providencia<br />
              María López,33 9876 5432,maria@email.com,,Facebook,Casa en Zapopan
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === "preview" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">{rows.length} leads encontrados</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setStep("upload"); setRows([]); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={loading || rows.length === 0}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-800 rounded-lg hover:bg-brand-900 disabled:opacity-50"
              >
                {loading ? "Importando..." : `Importar ${rows.length} leads`}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left font-medium text-gray-500 px-4 py-3 w-8">#</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Nombre</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Teléfono</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Email</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Empresa</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Fuente</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Interés</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                      <td className="px-4 py-2 text-gray-600">{row.phone || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">{row.email || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">{row.company || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">{row.source || "—"}</td>
                      <td className="px-4 py-2 text-gray-600 truncate max-w-[200px]">{row.interest || "—"}</td>
                      <td className="px-2 py-2">
                        <button onClick={() => removeRow(i)} className="p-1 text-gray-300 hover:text-danger-500">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === "result" && result && (
        <div className="max-w-md mx-auto text-center py-8">
          <div className="h-16 w-16 rounded-full bg-success-50 text-success-500 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Importación completada</h2>
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 text-left">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-success-600">{result.created}</p>
                <p className="text-xs text-gray-500">Creados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning-600">{result.skipped}</p>
                <p className="text-xs text-gray-500">Omitidos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{result.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
            {result.errors?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Errores:</p>
                {result.errors.map((err: string, i: number) => (
                  <p key={i} className="text-xs text-danger-600">{err}</p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/leads" className="px-4 py-2.5 text-sm font-semibold text-white bg-brand-800 rounded-lg hover:bg-brand-900">
              Ver leads
            </Link>
            <button
              onClick={() => { setStep("upload"); setRows([]); setResult(null); }}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Importar más
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
