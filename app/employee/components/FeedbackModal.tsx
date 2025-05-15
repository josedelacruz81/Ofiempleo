"use client";
import { Rating } from "@/components/littleComponents/Rating";
import { useToast } from "@/components/shadCn/useToast";
import { capitalizeFirstLetter, getRating } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { defaultComments, defaultEmployeeComments, EMPLOYEE, EMPLOYER } from "@/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Chip, ScrollShadow, Textarea, User } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineCheck, HiOutlineExclamation } from "react-icons/hi";
interface errorsInterface {
  comment?: string;
  message?: string;
}

export const FeedbackModal = ({
  isOpen,
  comments,
  onOpenChange,
  requester,
  session,
  postId,
  commentRecipientId,
  onClose,
  isEmployee,
}: {
  isOpen: boolean;
  comments?: any;
  onOpenChange: () => void;
  requester: any;
  session: any;
  postId: string;
  commentRecipientId: string;
  isEmployee?: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<errorsInterface>({});
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [commentSelectet, setCommentSelectet] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const getCommets = async () => {
    await supabase.from("comments").select("*").eq("postId", postId);
  };

  const handleRatingChange = async (i: number) => {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("userId", commentRecipientId)
      .eq("ratedBy", session?.user.id);
    if (error) {
      console.log("este es el error", error);
      return;
    }

    if (!!data.length) {
      setRating(i + 1);
      const { error } = await supabase
        .from("ratings")
        .update({ rating: i + 1 })
        .eq("userId", commentRecipientId)
        .eq("ratedBy", session?.user.id);
      if (error) {
        console.log(error);
        return;
      }

      return;
    }
    setRating(i + 1);
    const { error: insertError } = await supabase.from("ratings").insert({
      userId: commentRecipientId,
      rating: i + 1,
      ratedBy: session?.user.id,
    });
    if (insertError) {
      console.log(insertError);
      return;
    }

    return;
    // await supabase
    //   .from("ratings")
    //   .insert({ userId, rating: i + 1, ratedBy: session?.user.id });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrors({});
   
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        body: JSON.stringify({
          commenterId: parseInt(session.user.id),
          comment,
          postId: postId as string,
          commentRecipientId: parseInt(commentRecipientId),
          rating,
          role: isEmployee ? EMPLOYEE : EMPLOYER,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || data.comment,
          className: "bg-red-400 text-white",
        });

        return;
      }
      toast({
        title: "Éxito",
        description: data.message,
        className: "bg-green-400 text-white",
      });
      setComment("");
      router.refresh();
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async () => {
    const res = await getRating(requester.id);

    setRating(res);
  };
  useEffect(() => {
    handleRating();
  }, []);

  const handleCheck = (key: number) => {
    setCommentSelectet(key);
    setComment(
      isEmployee
        ? defaultEmployeeComments[key].message
        : defaultComments[key].message
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {!!comments && comments.length > 0 && (
            <ModalBody className="flex flex-row items-center py-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2>Ya comentaste sobre esta persona</h2>
                  <span className="bg-success text-white flex items-center justify-center rounded-full p-1">
                    <HiOutlineCheck size={20} />
                  </span>
                </div>
                <p className="text-default-500 text-sm">
                  Gracias por enviar tu comentario
                </p>
              </div>
            </ModalBody>
          )}

          {comments.length === 0 && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Califica y Comenta</h3>
                <p className="text-small font-medium text-gray-500">
                  {isEmployee
                    ? `¿Cómo fue tu experiencia trabajando para ${requester.names}?`
                    : `¿Cómo fue tu experiencia con el trabajo de ${requester.names}?`}
                </p>
              </ModalHeader>
              <ModalBody className="space-y-3">
                <User
                  name={`${requester.names} ${requester.lastname}`}
                  avatarProps={{
                    src: requester.profileImage,
                    name: `${requester.names} ${requester.lastname}`,
                  }}
                />

                <div className="flex flex-col items-center ">
                  <h3 className="text-lg font-semibold">Califica:</h3>
                  <Rating
                    size="2xl"
                    session={session}
                    userId={requester.id}
                    rating={rating}
                    setRating={setRating}
                  />
                </div>
                <ScrollShadow className="scrollComments flex flex-wrap gap-2 max-h-44">
                  {isEmployee
                    ? defaultEmployeeComments.map((comment, index) => (
                        <Chip
                          as={Button}
                          onPress={() => handleCheck(index)}
                          key={index}
                          color={
                            comment.feeling === "positivo"
                              ? "primary"
                              : comment.feeling === "neutral"
                              ? "warning"
                              : "danger"
                          }
                          variant={index === commentSelectet ? "flat" : "light"}
                        >
                          {comment.message}
                        </Chip>
                      ))
                    : defaultComments.map((comment, index) => (
                        <Chip
                          as={Button}
                          onPress={() => handleCheck(index)}
                          key={index}
                          color={
                            comment.feeling === "positivo"
                              ? "primary"
                              : comment.feeling === "neutral"
                              ? "warning"
                              : "danger"
                          }
                          variant={index === commentSelectet ? "flat" : "light"}
                        >
                          {comment.message}
                        </Chip>
                      ))}
                </ScrollShadow>
                <fieldset>
                  <Textarea
                    onChange={(e) => setComment(e.target.value)}
                    name="comment"
                    value={comment}
                    label="Añade un comentario"
                    placeholder="Escribe aquí tu comentario"
                    variant="faded"
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-xs">{errors.comment}</p>
                  )}
                  {errors.message && (
                    <p className="text-red-500 text-xs">{errors.message}</p>
                  )}
                </fieldset>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isLoading}
                  onPress={handleSubmit}
                  color="primary"
                >
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
