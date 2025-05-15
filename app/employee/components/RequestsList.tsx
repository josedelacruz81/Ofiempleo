"use client";
import { request } from "@/types";
import { Divider, ScrollShadow } from "@nextui-org/react";
import { RequestCard } from "./RequestCard";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const RequestsList = ({
  requestsData,
  session,
}: {
  requestsData: {
    data: {
      pendingRequests: request[];
      acceptedRequests: request[];
      rejectedRequests: request[];
    };
    isEmpty: boolean;
  };
  session: Session;
}) => {
  const [requests, setRequests] = useState(requestsData);
  const getRequests = async () => {
    const userId = session?.user.id;
    // Aquí va tu lógica para obtener las solicitudes.
    const res = await fetch(`/api/employee/requests/${userId}`);
    const data = await res.json();
    // Ejemplo de retorno
    setRequests(data);
  };

  // useEffect(() => {
  //   getRequests(); // Ejecuta la función al montarse el componente
  // }, [session?.user.id]);

  // useEffect(() => {
  //   getRequests(); // Ejecuta la función al montarse el componente
  //   const intervalId = setInterval(() => {
  //     getRequests(); // Ejecuta la función cada 3 minutos
  //   }, 180000); // 3 minutos = 180,000 ms

  //   return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  // }, [session?.user.id]);

  useEffect(() => {
    supabase
      .channel("requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
        },
        (payload) => {
          console.log("Request updated", payload);
          getRequests();
        }
      )
      .subscribe();
  }, []);

  return (
    <>
      {requests.data.pendingRequests.length > 0 && (
        <>
          <article className="space-y-2">
            <h3 className="text-default-500">Pendientes:</h3>
            <div className="max-h-[250px] overflow-auto  space-y-2">
              {requests.data.pendingRequests.map(
                (request: any, index: number) => (
                  <RequestCard
                    session={session}
                    postId={request.postId}
                    getRequests={getRequests}
                    key={index}
                    request={request}
                    userId={session.user.id}
                  />
                )
              )}
            </div>
          </article>
          <Divider className="my-3" />
        </>
      )}

      {requests.data.acceptedRequests.length > 0 && (
        <>
          <article className="space-y-2">
            <h3 className="text-default-500">Aceptadas:</h3>
            <div className="max-h-[250px] overflow-auto space-y-2">
              {requests.data.acceptedRequests.map(
                (request: any, index: number) => (
                  <RequestCard
                    session={session}
                    postId={request.postId}
                    getRequests={getRequests}
                    key={index}
                    request={request}
                    userId={session.user.id}
                  />
                )
              )}
            </div>
          </article>
          <Divider className="my-3" />
        </>
      )}

      {requests.data.rejectedRequests.length > 0 && (
        <article className="space-y-2">
          <h3 className="text-default-500">Rechazadas:</h3>
          <div className="max-h-[250px] overflow-auto space-y-2">
            {requests.data.rejectedRequests.map(
              (request: any, index: number) => (
                <RequestCard
                  session={session}
                  postId={request.postId}
                  getRequests={getRequests}
                  key={index}
                  request={request}
                  userId={session.user.id}
                />
              )
            )}
          </div>
        </article>
      )}
    </>
  );
};
