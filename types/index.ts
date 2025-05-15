import { color } from "framer-motion";
import { ProfileImage } from "@/app/employee/components/profile";
import { SVGProps } from "react";
import { type DefaultSession } from "next-auth";

export const EMPLOYEE = "employee";
export const EMPLOYER = "employer";
export const PROFESSION = "profession";
export const SKILL = "skill";
export const ADMIN = "admin";
export const ACEPTED = "Aceptado";
export const PENDING = "Pendiente";
export const REJECTED = "Rechazado";
export const AVAILABLE = "available";
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface postStatusInterface {
  value: string;
  color: string;
}

export const postStatus: postStatusInterface[] = [
  {
    value: "Pendiente",
    color: "warning",
  },
  {
    value: "Rechazado",
    color: "danger",
  },
  {
    value: "Aceptado",
    color: "success",
  },
];

export const parroquias = [
  { label: "Portoviejo", value: "portoviejo" },
  { label: "Abdón Calderón", value: "abdon_calderon" },
  { label: "Alhajuela", value: "alhajuela" },
  { label: "Crucita", value: "crucita" },
  { label: "Pueblo Nuevo", value: "pueblo_nuevo" },
  { label: "Riochico", value: "riochico" },
  { label: "San Plácido", value: "san_placido" },
];

export interface comment {
  id: string;
  comment: string;
  commentRecipientId: string;
  commentRecipient?: userInterface;
  commenter?: userInterface;
  commenterId: string;
  created_at: string;
  role: "employee" | "employer";
}

export const defaultComments = [
  {
    id: 1,
    message: "Trabajo impecable. Muy profesional.",
    feeling: "positivo",
  },
  {
    id: 2,
    message: "Puntual y eficiente.",
    feeling: "positivo",
  },
  {
    id: 3,
    message: "Superó mis expectativas.",
    feeling: "positivo",
  },
  {
    id: 4,
    message: "Servicio rápido y de calidad.",
    feeling: "positivo",
  },
  {
    id: 5,
    message: "Muy satisfecho con el resultado.",
    feeling: "positivo",
  },
  {
    id: 6,
    message: "Atento y detallista.",
    feeling: "positivo",
  },
  {
    id: 7,
    message: "Gran habilidad y precisión.",
    feeling: "positivo",
  },
  {
    id: 8,
    message: "Trabajo limpio y bien hecho.",
    feeling: "positivo",
  },
  {
    id: 9,
    message: "Totalmente recomendable.",
    feeling: "positivo",
  },
  {
    id: 10,
    message: "Cumplió con todo lo solicitado.",
    feeling: "positivo",
  },
  {
    id: 11,
    message: "El servicio fue aceptable.",
    feeling: "neutral",
  },
  {
    id: 12,
    message: "Ni bueno ni malo, simplemente normal.",
    feeling: "neutral",
  },
  {
    id: 13,
    message: "Cumplió con lo básico.",
    feeling: "neutral",
  },
  {
    id: 14,
    message: "Podría mejorar en algunos aspectos.",
    feeling: "neutral",
  },
  {
    id: 15,
    message: "No cumplió con los plazos establecidos.",
    feeling: "negativo",
  },
  {
    id: 16,
    message: "Calidad inferior a lo esperado.",
    feeling: "negativo",
  },
  {
    id: 17,
    message: "Mala atención al cliente.",
    feeling: "negativo",
  },
  {
    id: 18,
    message: "No recomendaría sus servicios.",
    feeling: "negativo",
  },
];

export const defaultEmployeeComments = [
  {
    id: 1,
    message: "Excelente comunicación y claridad en las instrucciones.",
    feeling: "positivo",
  },
  {
    id: 2,
    message: "Pago puntual y justo.",
    feeling: "positivo",
  },
  {
    id: 3,
    message: "Ambiente de trabajo muy agradable y respetuoso.",
    feeling: "positivo",
  },
  {
    id: 4,
    message: "Oportunidades de crecimiento y aprendizaje.",
    feeling: "positivo",
  },
  {
    id: 5,
    message: "Flexibilidad en los horarios de trabajo.",
    feeling: "positivo",
  },
  {
    id: 6,
    message: "Muy colaborativo y abierto a sugerencias.",
    feeling: "positivo",
  },
  {
    id: 7,
    message: "Proyectos interesantes y desafiantes.",
    feeling: "positivo",
  },
  {
    id: 8,
    message: "Expectativas claras y realistas.",
    feeling: "positivo",
  },
  {
    id: 9,
    message: "Condiciones de trabajo adecuadas.",
    feeling: "neutral",
  },
  {
    id: 10,
    message: "Comunicación regular, pero podría mejorar.",
    feeling: "neutral",
  },
  {
    id: 11,
    message: "Proyectos interesantes, aunque a veces poco estructurados.",
    feeling: "neutral",
  },
  {
    id: 12,
    message: "Pago justo, pero sin beneficios adicionales.",
    feeling: "neutral",
  },
  {
    id: 13,
    message: "Falta de retroalimentación sobre el desempeño.",
    feeling: "negativo",
  },
  {
    id: 14,
    message: "Cambios frecuentes en las prioridades y plazos.",
    feeling: "negativo",
  },
  {
    id: 15,
    message: "Poca flexibilidad en los horarios de trabajo.",
    feeling: "negativo",
  },
  {
    id: 16,
    message: "Retrasos en los pagos acordados.",
    feeling: "negativo",
  },
];

export const jobs = [
  {
    name: "Albañil",
    description:
      "Trabaja en la construcción de edificaciones, muros, y otras estructuras.",
    value: "albanil",
  },
  {
    name: "Carpintero",
    description:
      "Trabaja con la madera, construyendo y reparando muebles, estructuras, y otros artículos de madera.",
    value: "carpintero",
  },
  {
    name: "Electricista",
    description:
      "Se encarga de la instalación, mantenimiento y reparación de sistemas eléctricos.",
    value: "electricista",
  },
  {
    name: "Fontanero/Plomero",
    description:
      "Especialista en la instalación y reparación de sistemas de agua y desagüe.",
    value: "fontanero_plomero",
  },
  {
    name: "Mecánico",
    description:
      "Trabaja en la reparación y mantenimiento de vehículos y maquinaria.",
    value: "mecanico",
  },
  {
    name: "Soldador",
    description:
      "Une piezas de metal mediante el uso de calor y herramientas especializadas.",
    value: "soldador",
  },
  {
    name: "Pintor",
    description:
      "Se dedica a la pintura de edificios, vehículos, y otras superficies.",
    value: "pintor",
  },
  {
    name: "Cerrajero",
    description: "Trabaja con cerraduras y sistemas de seguridad.",
    value: "cerrajero",
  },
  {
    name: "Jardinero",
    description: "Encargado del mantenimiento de jardines y áreas verdes.",
    value: "jardinero",
  },
  {
    name: "Tapicero",
    description:
      "Especialista en la reparación y confección de tapizados para muebles y automóviles.",
    value: "tapicero",
  },
  {
    name: "Reparador de electrodomésticos",
    description:
      "Repara y mantiene aparatos eléctricos como lavadoras, refrigeradores, y otros electrodomésticos.",
    value: "reparador_electrodomesticos",
  },
  {
    name: "Vidriero",
    description:
      "Trabaja con el vidrio, instalando ventanas, vitrales y otros elementos de vidrio.",
    value: "vidriero",
  },
  {
    name: "Sastre/Modista",
    description: "Confecciona y repara ropa.",
    value: "sastre_modista",
  },
  {
    name: "Techador",
    description: "Se dedica a la instalación y reparación de techos.",
    value: "techador",
  },
  {
    name: "Peluquero/Barbero",
    description: "Proporciona servicios de corte de cabello y afeitado.",
    value: "peluquero_barbero",
  },
];

export interface jobInterface {
  id: string;
  name: string;
  description: string;
  value: string;
}

export interface skillInterface {
  id: string;
  created_at: string;
  jobId: string;
  name: string;
}

export interface userTypeInterface {
  role: "employee" | "employer" | "admin" | "";
}
export interface StatCardProps {
  header: string;
  icon: React.ReactNode;
  stat: number;
  data:request[];
  color:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "default"
    | "danger"
  href: string;
}
export enum Role {
  Employee = "employee",
  Employer = "employer",
  Admin = "admin",
}
export interface userInterface {
  id: string;
  email: string;
  names: string;
  lastname: string;
  description: string;
  phone: string;
  profileImage: string;
  rating: number;
  role: Role;
  location: string;
  isBanned: boolean | null;
  banFinishDate: string | null;
  banReason: string | null;
}

export interface data {
  primary: string;
  secondary: number;
  radius?: number;
}

export interface Series {
  label: string;
  data: data[];
}

export interface credentialsInterface {
  id: string;
  password: string;
  location?: string;
  profession?: string;
  confirmPassword?: string;
  email?: string;
  phone?: string;
  role?: "employee" | "employer" | "admin" | "";
  description?: string;
  names?: string;
  lastname?: string;
  rating?: number;
  profileImage?: string;
  created_at?: string;
}

export interface SessionInterface {
  user: credentialsInterface | null;
}

enum role {
  employee = "employee",
  employer = "employer",
  admin = "admin",
}

export interface rating {
  id: string;
  created_at: string;
  rating: number;
  userId: string;
  ratedBy: userInterface;
  role: role;
  user?: userInterface;
}

export interface Skills {
  id?: string;
  jobId?: string;
  name: string;
}

export interface PostInterface {
  id: string;
  description: string;
  images: string[];
  hourly: number;
  status: string;
  created_at: string;
  profession: jobInterface;
  skills: string[];
  typeWork?: string;
  userId: string;
  users: userInterface;
}

export const payTypes = [
  {
    label: "Por hora",
    value: "hourly",
  },
  {
    label: "Por día",
    value: "daily",
  },
  {
    label: "Por trabajo",
    value: "job",
  },
];

export interface request {
  id: string;
  created_at: string;
  status: string;
  message: string;
  postId: string;
  post: PostInterface;
  requesterId: string;
  requester: userInterface;
}
export enum keys {
  mensual = "mensual",
  semanal = "semanal",
  todo = "todo",
}

export interface UserManagment {
  count: number;
  result: userInterface[];
  next: string;
}

export interface jobRequest {
  id: string;
  created_at: string;
  jobName: string;
  status: string;
  userId: string;
  user: userInterface;
}

export interface report {
  id: string;
  reportedBy: string;
  reportedId: string;
  reason: string;
  reported: userInterface;
  reportedByUser: userInterface;
}

export interface searchResult {
  result_type: "users" | "posts" | "jobs";
  result_id: string | number;
  result: string;
  image: string;
  profession: string;
  email: string;
}
