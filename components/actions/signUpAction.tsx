"use server";

export const signUpAction = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const res = await fetch(`${process.env.PUBLIC_URL}/api/auth/signUp`, {
    method: "POST",
    body: JSON.stringify(rawFormData),
    
  });
  const data = await res.json();

  if (!res.ok) {
    return {
      message: data || "Error al registrar usuario",
    };
  }
  return {
    message: "Usuario registrado correctamente"
  }
  
};
