export { auth as middleware } from "@/auth"
// import { auth } from "@/auth";

// export default auth(async (req) => {
//   // if (!req.auth && req.nextUrl.pathname !== "/login") {
//   //   const newUrl = new URL("/auth", req.nextUrl.origin)
//   //   return Response.redirect(newUrl)
//   // }

//   const isLoggedIn = !!req.auth;

//   const currentUrl = req.nextUrl.pathname;
//   if (!isLoggedIn && currentUrl === "/employee") {
//     const newUrl = new URL("/auth", req.nextUrl.origin);
//     return Response.redirect(newUrl);
//   }
//   // if (isLoggedIn && currentUrl === "/employee") {
//   //   const { data, error } = await supabase
//   //     .from("users")
//   //     .select("role")
//   //     .eq("id", req.auth?.user.id)
//   //     .single();
//   //   if (error) return Response.error();
//   //   if(data.role !== EMPLOYEE) return Response.redirect(new URL("/", req.nextUrl.origin));

//   // }
//   // if (isLoggedIn && currentUrl === "/") {
//   //   const { data, error } = await supabase
//   //     .from("users")
//   //     .select("role")
//   //     .eq("id", req.auth?.user.id)
//   //     .single();
//   //   if (error) return Response.error();
//   //   if(data.role === EMPLOYEE) return Response.redirect(new URL("/employee", req.nextUrl.origin));
//   // }
// });

// export const config = {
//   matcher: ["/employee"],
// };
