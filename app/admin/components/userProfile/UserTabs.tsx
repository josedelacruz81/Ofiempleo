"use client";
import {
  comment,
  PostInterface,
  report,
  request,
  userInterface,
} from "@/types";
import {
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Session } from "next-auth";
import { ProfileTab } from "./ProfileTab";
import { RequestsTab } from "./RequestsTab";
import { ReportsTab } from "./ReportsTab";
import { CommentsTab } from "./CommentsTab";

interface requestAdd extends request {
  ownerId: string;
  owner: userInterface;
}
export const UserTabs = ({
  post,
  requests,
  reports,
  comments
}: {
  post: PostInterface;
  requests: requestAdd[];
  reports: report[];
  comments: {
    employees: comment[];
    employers: comment[];
  };
}) => {
  return (
    <div className="grow">
      <Tabs fullWidth aria-label="Options">
        <Tab key="profile" title="Perfil publicado">
          <ProfileTab post={post} />
        </Tab>
        <Tab key="requests" title="Solicitudes">
          <RequestsTab requests={requests} />
        </Tab>
        <Tab key="comments" title="Comentarios">
          <CommentsTab commentsEmployer={comments.employers}  commentsEmployee={comments.employees}/>
        </Tab>
        <Tab key="reports" title="Reportes">
          <ReportsTab reports={reports} />
        </Tab>
        
      </Tabs>
    </div>
  );
};
