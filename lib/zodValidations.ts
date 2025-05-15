import { z } from "zod";

export function processZodError(error: any) {
  if (!error || !error.errors) return {};

  return error.errors.reduce((acc: any, err: any) => {
    if (err.path && err.path.length > 0) {
      acc[err.path[0]] = err.message;
    }
    return acc;
  }, {});
}

export const hourlyValidation = z
  .number()
  .positive("Tienes que ingresar un valor");

export const jobUpdateSchema = z.object({
  description: z
    .string()
    .min(18, "La descripción debe tener al menos 18 caracteres"),
  skills: z.string().array().nonempty({
    message: "Debes seleccionar al menos una habilidad",
  }),
  typeWork: z.string({
    message: "Debes seleccionar un modo de trabajo",
  }),
});

export const signUpSchema = z.object({
  id: z.string().min(10, {
    message: "Ingrese el número de cédula",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
      invalid_type_error: "Ingrese un correo electrónico válido",
    })
    .min(6, {
      message: "El correo electrónico debe tener al menos 6 caracteres",
    })
    .email({
      message: "Ingrese un correo electrónico válido",
    }),
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres",
  }),

  phone: z
    .string({
      required_error: "Ingrese un número de teléfono",
    })
    .min(10, {
      message: "El teléfono debe tener al menos 10 caracteres",
    })
    .max(10, {
      message: "El teléfono debe tener máximo 10 caracteres",
    }),
});

export const credentialsSchema = z.object({
  id: z.string().min(10),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido",
  }),
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres",
  }),

  phone: z
    .string()
    .min(10, {
      message: "El teléfono debe tener 10 caracteres",
    })
    .max(10, {
      message: "El teléfono debe tener máximo 10 caracteres",
    }),
});

export const commentSchema = z.object({
  comment: z
    .string({
      required_error: "El comentario es requerido",
    })
    .min(10, {
      message: "El comentario debe tener al menos 18 caracteres",
    })
    .max(200, {
      message: "El comentario debe tener máximo 200 caracteres",
    }),
  postId: z.number({
    required_error: "El postId es requerido",
  }),
  commenterId: z.number({
    required_error: "El commenterId es requerido",
  }),
  commentRecipientId: z.number({
    required_error: "El commenterId es requerido",
  }),
  rating: z.number({
    required_error: "La calificación es requerida",
  }),
  role: z.string({
    required_error: "El rol es requerido",
  }),
});

export const passwordSchema = z.object({
  oldPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  newPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export const userDataSchema = z.object({
  location: z
    .string({
      required_error: "La ubicación es requerida",
      invalid_type_error: "Ingrese una ubicación válida",
    })
    .min(3, {
      message: "La ubicación debe tener al menos 3 caracteres",
    }),
  description: z.string().optional(),
});

export const phoneSchema = z.object({
  phone: z
    .string({
      required_error: "Ingrese un número de teléfono",
    })
    .min(10, {
      message: "El teléfono debe tener al menos 10 caracteres",
    })
    .max(10, {
      message: "El teléfono debe tener máximo 10 caracteres",
    }),
});

export const jobRequestSchema = z.object({
  jobName: z
    .string({
      required_error: "El nombre del trabajo es requerido",
      invalid_type_error: "Ingrese un nombre válido",
    })
    .min(6, {
      message: "El nombre del trabajo debe tener al menos 10 caracteres",
    }),
});

export const jobSchema = z.object({
  jobName: z
    .string({
      required_error: "El nombre del trabajo es requerido",
      invalid_type_error: "Ingrese un nombre válido",
    })
    .min(6, {
      message: "El nombre del trabajo debe tener al menos 10 caracteres",
    }),
  description: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "Ingrese una descripción válida",
    })
    .min(18, {
      message: "La descripción debe tener al menos 18 caracteres",
    }),
});