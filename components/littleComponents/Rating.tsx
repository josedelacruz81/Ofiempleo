"use client";
import { FaRegStar, FaStar } from "react-icons/fa";

export const Rating = ({
  rating,
  setRating,
  disabled,
  size
}: {
  userId?: string;
  setRating?: (rating: number) => void;
  rating: number;
  disabled?: boolean;
  session?: any;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}) => {
  // const { toast } = useToast();


  // const handleClick = async (i: number) => {
  //   if (!session) {
  //     return toast({
  //       className: "text-white bg-yellow-400",
  //       //@ts-ignore
  //       title: (
  //         <div className="flex items-center gap-2">
  //           <p>Alerta</p>
  //           <HiOutlineExclamation className="text-white" size={20} />
  //         </div>
  //       ),
  //       description: "Debes iniciar sesión para calificar a un usuario",
  //     });
  //   }

  //   const { data, error } = await supabase
  //     .from("ratings")
  //     .select("*")
  //     .eq("userId", userId)
  //     .eq("ratedBy", session?.user.id);
  //   if (error) {
  //     console.log("este es el error",error);
  //     return;
  //   }
    
  //   if (!!data.length) {
  //     setRating(i + 1);
  //     const { error } = await supabase
  //       .from("ratings")
  //       .update({ rating: i + 1 })
  //       .eq("userId", userId)
  //       .eq("ratedBy", session?.user.id);
  //     if (error) {
  //       console.log(error);
  //       return;
  //     }
  //     toast({
  //       className: "text-white bg-green-400",
  //       title: "Éxito",
  //       description: "Calificación enviada con éxito",
  //     });
  //     return;
  //   }
  //   setRating(i + 1);
  //   const { error:insertError } = await supabase
  //     .from("ratings")
  //     .insert({ userId, rating: i + 1, ratedBy: session?.user.id });
  //   if (insertError) {
  //     console.log(insertError);
  //     return;
  //   }

  //   return;
  //   // await supabase
  //   //   .from("ratings")
  //   //   .insert({ userId, rating: i + 1, ratedBy: session?.user.id });
  // };

  const handleSize =  () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      case "2xl":
        return "text-2xl";
      default:
        return "text-sm";
    }
  }


  return (
    <div className="flex gap-1 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <button onClick={() => setRating && setRating(i+1)} disabled={disabled} key={i}>
          {i < rating ? <FaStar className={handleSize()}/> : <FaRegStar className={handleSize()}/>}
        </button>
      ))}
    </div>
  );
};
