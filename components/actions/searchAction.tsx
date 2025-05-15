"use server";

import { supabase } from "@/lib/supabase";
import { PROFESSION, SKILL } from "@/types";

export async function searchAction(formData: FormData, category: any) {
  try {
    switch (category.key) {
      case PROFESSION: {
        const query = formData.get("query") as string;
        const { data, error } = await supabase
          .from("posts")
          .select("*,users (names,lastname)")
          .filter('profession', 'ilike', `%${query}%`);
        if(error){
          return [];
        }
        return data;
      }

      case SKILL: {
        const query = formData.get("query") as string;
        // const { data, error } = await supabase
        //   .from("posts")
        //   .select("*")
        //   .textSearch("profession || description", query);
        const { data, error } = await supabase
          .from("posts")
          .select("*,users (names,lastname)")
          .contains("skills", [query]);
        if(error){
          return [];
        }
        
        return data;
      }

      case "users": {
        const query = formData.get("query") as string;
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .filter('names', 'ilike', `%${query}%`);
        if(error){
          console.log(error);
          return [];
        }
        
        return data;
      }

    }
    //   const query = formData.get("query") as string;

    // const { data:byProfessionSearch, error:professionError } = await supabase
    //   .from("posts")
    //   .select("*")
    //   .textSearch("profession || description", query);

    // const { data:bySkillsSearch, error:skillsError } = await supabase
    //   .from("posts")
    //   .select("*,users (names,lastname)")
    //   .contains("skills", [query]);
    //   console.log(byProfessionSearch, bySkillsSearch);
    // if(!!professionError || !!skillsError) throw new Error("Error");
    // return [...byProfessionSearch, ...bySkillsSearch];
  } catch (error) {
    console.log(error);
    return [];
  }
}
