import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabase } from "./lib/supabase";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      role: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        id: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;
        let user = null;

        try {
          const { data, error } = await supabase
            .from("users")
            .select("id, names, email, profileImage, role, password,isBanned")
            .eq("id", credentials.id)
            .single();
          
          if (error) return(console.log(error), null);
          if(!data) throw new Error("Usuario no encontrado");
          if(data.isBanned) throw new Error("Usuario baneado");
          if(!data.password.match(credentials.password)) throw new Error("Contraseña incorrecta");
          user = data;

          return {
            id: user.id,
            name: user.names,
            email: user.email,
            image: user.profileImage,
            role: user.role,
          };
        } catch (error: any) {
          console.error(error);
          throw new Error(error.message);
        }
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      
      if (user) {
        // User is available during sign-in
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }: { session: any; token: any }) => {
    
      session.accessToken = token.accessToken
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },

  },
});
