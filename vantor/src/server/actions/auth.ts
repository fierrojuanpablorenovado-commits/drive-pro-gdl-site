"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/server/db";
import { registerSchema, loginSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function registerAction(formData: FormData) {
  const raw = {
    orgName: formData.get("orgName") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("phone") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { orgName, name, email, password, phone } = parsed.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Ya existe una cuenta con este email" };
  }

  const passwordHash = await hash(password, 12);
  let slug = generateSlug(orgName);

  const existingOrg = await db.organization.findUnique({ where: { slug } });
  if (existingOrg) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const org = await db.organization.create({
    data: {
      name: orgName,
      slug,
      pipelineStages: {
        createMany: {
          data: [
            { name: "Nuevo", position: 0, color: "#6B7280", isDefault: true },
            { name: "Contactado", position: 1, color: "#3B82F6" },
            { name: "Interesado", position: 2, color: "#8B5CF6" },
            { name: "En seguimiento", position: 3, color: "#F59E0B" },
            { name: "Cita / Reunión", position: 4, color: "#EC4899" },
            { name: "Propuesta", position: 5, color: "#14B8A6" },
            { name: "Negociación", position: 6, color: "#F97316" },
            { name: "Cerrado ganado", position: 7, color: "#10B981", isClosedWon: true },
            { name: "Cerrado perdido", position: 8, color: "#EF4444", isClosedLost: true },
          ],
        },
      },
      lostReasons: {
        createMany: {
          data: [
            { name: "Precio" },
            { name: "Competencia" },
            { name: "No responde" },
            { name: "No calificado" },
            { name: "Timing inadecuado" },
            { name: "Otro" },
          ],
        },
      },
      leadSources: {
        createMany: {
          data: [
            { name: "WhatsApp", type: "messaging" },
            { name: "Facebook", type: "social" },
            { name: "Instagram", type: "social" },
            { name: "Formulario web", type: "form" },
            { name: "Referido", type: "referral" },
            { name: "Llamada", type: "phone" },
            { name: "Otro", type: "other" },
          ],
        },
      },
      subscription: {
        create: {
          plan: "STARTER",
          status: "TRIAL",
          maxUsers: 3,
          periodStart: new Date(),
          periodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  await db.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "OWNER",
      phone: phone || null,
      orgId: org.id,
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    await signIn("credentials", {
      email: raw.email,
      password: raw.password,
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    if (error?.type === "CredentialsSignin") {
      return { error: "Email o contraseña incorrectos" };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
