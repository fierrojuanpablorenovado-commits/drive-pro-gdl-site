import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Kanban,
  MessageSquare,
  Shield,
  Target,
  Users,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold text-brand-800 tracking-tight">
            Vantor
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#problema" className="hover:text-brand-800 transition-colors">
              Problema
            </a>
            <a href="#funciones" className="hover:text-brand-800 transition-colors">
              Funciones
            </a>
            <a href="#beneficios" className="hover:text-brand-800 transition-colors">
              Beneficios
            </a>
            <a href="#pricing" className="hover:text-brand-800 transition-colors">
              Planes
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-brand-800 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-brand-900 transition-colors"
            >
              Solicitar demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-blue-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5" />
              Plataforma de ejecución comercial
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 leading-tight tracking-tight">
              Control comercial que{" "}
              <span className="text-brand-500">sí convierte</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Ordena tus leads, prioriza seguimientos y acelera tus cierres
              desde un solo sistema. Vantor ayuda a equipos comerciales a dejar
              de perder ventas por desorden, seguimiento tardío y falta de
              trazabilidad.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-brand-800 text-white text-base font-semibold px-8 py-4 rounded-xl hover:bg-brand-900 transition-colors shadow-lg shadow-brand-800/25"
              >
                Solicitar demo
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#funciones"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 text-base font-semibold px-8 py-4 rounded-xl border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                Sin tarjeta requerida
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                Setup en minutos
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                Soporte en español
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problema" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900">
              Tus ventas no se pierden por falta de interés
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Se pierden por desorden, atraso y falta de seguimiento.
              Vantor lo corrige.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Chats dispersos",
                desc: "Conversaciones en WhatsApp, DMs y correo sin trazabilidad",
              },
              {
                icon: Bell,
                title: "Seguimientos olvidados",
                desc: "Prospectos que se enfrían porque nadie les da seguimiento a tiempo",
              },
              {
                icon: Users,
                title: "Vendedores sin orden",
                desc: "Cada vendedor trabaja a su manera, sin proceso ni prioridad",
              },
              {
                icon: BarChart3,
                title: "Sin visibilidad",
                desc: "Dirección toma decisiones a ciegas, sin datos de conversión ni pipeline",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-brand-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-danger-50 text-danger-500 mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funciones" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900">
              Todo lo que necesitas para ejecutar ventas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No es un CRM genérico. Es tu sistema de ejecución comercial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Captura de leads",
                desc: "Centraliza leads de WhatsApp, formularios, redes sociales, campañas y carga manual en un solo lugar.",
              },
              {
                icon: Kanban,
                title: "Pipeline visual",
                desc: "Kanban configurable con semáforo de urgencia. Ve en qué etapa está cada prospecto y muévelo con un clic.",
              },
              {
                icon: CheckCircle2,
                title: "Seguimiento y tareas",
                desc: "Vista 'Mi día' con prioridades claras. Registra llamadas, WhatsApp, reuniones y agenda la siguiente acción.",
              },
              {
                icon: Bell,
                title: "Alertas de fuga",
                desc: "Detecta leads sin atender, seguimientos vencidos y prospectos estancados antes de que se pierdan.",
              },
              {
                icon: BarChart3,
                title: "Reportes ejecutivos",
                desc: "Conversión por etapa, cierre por vendedor, leads por canal, tiempo de respuesta. Datos claros, sin complicación.",
              },
              {
                icon: Shield,
                title: "Control y permisos",
                desc: "Roles para dueño, gerente, vendedor y supervisor. Cada quien ve lo que necesita, nada más.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-50 text-brand-600 mb-4 group-hover:bg-brand-100 transition-colors">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-20 lg:py-28 bg-brand-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Más control. Más seguimiento. Menos fugas. Más cierres.
            </h2>
            <p className="mt-4 text-lg text-white/70">
              El mercado está lleno de herramientas que administran leads.
              Vantor ejecuta ventas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "2x", label: "más seguimientos ejecutados" },
              { metric: "-60%", label: "menos leads olvidados" },
              { metric: "+35%", label: "tasa de conversión" },
              { metric: "10s", label: "para saber qué hacer hoy" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-6 rounded-xl bg-white/10 backdrop-blur"
              >
                <div className="text-4xl font-bold text-white">
                  {item.metric}
                </div>
                <p className="mt-2 text-sm text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900">
              Pensado para tu tipo de negocio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Si vendes por WhatsApp, formularios o redes sociales, Vantor es
              para ti.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Inmobiliarias",
              "Financieras",
              "Reclutamiento",
              "Clínicas",
              "Arrendamiento",
              "Educación",
              "Servicios",
              "E-commerce",
            ].map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <Target className="h-5 w-5 text-brand-500 shrink-0" />
                <span className="text-sm font-medium text-brand-900">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900">
              Planes simples, valor real
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Sin contratos. Sin sorpresas. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-brand-200 hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-brand-900">Starter</h3>
              <p className="mt-1 text-sm text-gray-500">Para microempresas</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-brand-900">$499</span>
                <span className="text-gray-500 text-sm"> MXN/mes</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Hasta 3 usuarios",
                  "Pipeline básico",
                  "Leads y tareas",
                  "Dashboard básico",
                  "Reportes simples",
                  "Import CSV",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-success-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full text-center bg-white text-brand-800 font-semibold py-3 rounded-lg border-2 border-brand-200 hover:bg-brand-50 transition-colors"
              >
                Comenzar gratis
              </Link>
            </div>

            {/* Growth */}
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-500 shadow-lg relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                Más popular
              </div>
              <h3 className="text-lg font-semibold text-brand-900">Growth</h3>
              <p className="mt-1 text-sm text-gray-500">
                Para equipos pequeños
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-brand-900">
                  $1,490
                </span>
                <span className="text-gray-500 text-sm"> MXN/mes</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Hasta 10 usuarios",
                  "Alertas de fuga",
                  "Reportes avanzados",
                  "Automatizaciones básicas",
                  "Integración formularios",
                  "Google Sheets",
                  "Soporte por chat",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-success-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full text-center bg-brand-800 text-white font-semibold py-3 rounded-lg hover:bg-brand-900 transition-colors"
              >
                Solicitar demo
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-brand-200 hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-brand-900">Pro</h3>
              <p className="mt-1 text-sm text-gray-500">
                Para equipos estructurados
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-brand-900">
                  $3,900
                </span>
                <span className="text-gray-500 text-sm"> MXN/mes</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Hasta 25 usuarios",
                  "Permisos avanzados",
                  "Reportes por vendedor y canal",
                  "Automatizaciones avanzadas",
                  "WhatsApp Business API",
                  "Meta Lead Ads",
                  "Soporte prioritario",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-success-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full text-center bg-white text-brand-800 font-semibold py-3 rounded-lg border-2 border-brand-200 hover:bg-brand-50 transition-colors"
              >
                Contactar ventas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-900">
            Deja de perder ventas por desorden
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Vantor organiza tus leads, seguimientos y pipeline comercial para
            que tu equipo venda con más control, más velocidad y menos fuga.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-800 text-white text-base font-semibold px-8 py-4 rounded-xl hover:bg-brand-900 transition-colors shadow-lg shadow-brand-800/25"
            >
              Comenzar ahora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xl font-bold tracking-tight">Vantor</span>
              <p className="mt-1 text-sm text-white/60">
                Plataforma de ejecución comercial
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contacto
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
            &copy; {new Date().getFullYear()} Vantor. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
