import { comment, EMPLOYEE, EMPLOYER, rating, Role } from "@/types";
import { supabase } from "./supabase";

export function timeAgo(date: any) {
  const now = new Date() as any;
  const past = new Date(date) as any;
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return "ahora";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${
      diffInMinutes === 1 ? "minuto" : "minutos"
    }`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} ${diffInYears === 1 ? "año" : "años"}`;
}

export const getRating = async (
  userId: string | undefined
): Promise<number> => {
  const { data, error } = await supabase
    .from("ratings")
    .select("rating")
    .eq("userId", userId);

  if (error || data.length === 0) {
    return 0;
  }

  const ratings = data.map((item) => item.rating);
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  return average;
};

export const getRatingCount = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("ratings")
    .select("rating", { count: "exact" })
    .eq("userId", userId);

  if (error || data.length === 0) {
    return 0;
  }

  return data.length;
};

export function capitalizeWords(text: string) {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
export function capitalizeFirstLetter(text: string | null | undefined) {
  if(text === null || text === undefined) return "";
  return text
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
}

export const deleteCero = (phone: string) => {
  if (phone[0] === "0") {
    return phone.slice(1);
  }
  return phone;
};

export const getComments = async (userId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*,commenter:commenterId(*)")
    .eq("commenterId", userId);
  if (error) {
    console.log(error);
    return [];
  }
  return data;
};

export const selectColor = (status: string) => {
  switch (status) {
    case "Pendiente":
      return "warning";
    case "Aceptado":
      return "success";
    case "Rechazado":
      return "danger";
    default:
      return "secondary";
  }
};

export function filterCommentsByRole(comments: comment[]) {
  const employees: comment[] = [];
  const employers: comment[] = [];

  comments.forEach((comment) => {
    if (comment.role === EMPLOYEE) {
      employees.push(comment);
    } else if (comment.role === EMPLOYER) {
      employers.push(comment);
    }
  });

  return { employees, employers };
}

export function filterRequestsByStatus(requests: any[]) {
  const pendientes: any[] = [];
  const aceptadas: any[] = [];
  const rechazadas: any[] = [];

  requests.forEach((request) => {
    if (request.status === "Pendiente") {
      pendientes.push(request);
    } else if (request.status === "Aceptado") {
      aceptadas.push(request);
    } else if (request.status === "Rechazado") {
      rechazadas.push(request);
    }
  });

  return { pendientes, aceptadas, rechazadas };
}

export function filterRatingByRole(data: rating[]) {
  // Inicializar los objetos para almacenar los datos separados
  const resultado = {
    employees: [] as rating[],
    employers: [] as rating[],
  };

  // Recorrer el array y separar los elementos por su role
  data.forEach((item: rating) => {
    if (item.role === "employee") {
      resultado.employees.push(item);
    } else if (item.role === "employer") {
      resultado.employers.push(item);
    }
  });

  return resultado;
}

export const getRole = async (
  userId: string | undefined
): Promise<Role | null> => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();
  if (error) {
    console.log(error);
    return null;
  }

  return data.role;
};

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}