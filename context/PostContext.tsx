"use client";
import { PostInterface } from "@/types";

import { useState, useContext, createContext, ReactNode, useEffect } from "react";

interface PostContextType {
  posts: PostInterface[] | null;
  setPosts?: (posts: any[]) => void;
  getPost: (id: string) => void;
  loading?: boolean;
  emptyPost: () => void;
  open?: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  users: any;
  setUsers: (users: any) => void;
}

export const usePost = () => {
  if (!useContext(PostContext)) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return useContext(PostContext);
};

export const PostContext = createContext<PostContextType>({
  posts: null,
  getPost: () => {},
  loading: true,
  emptyPost: () => {},
  open: false,
  setPosts: () => {}, 
  handleOpen: () => {},
  handleClose: () => {},
  users: null,
  setUsers: () => {},
});

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const emptyPost = () => {
    setPosts(null);
  };
  const [users, setUsers] = useState<any>(null);
 
  const getPost = async (id: string | number) => {
    try {
      const res = await fetch(`${process.env.PUBLIC_URL}/api/posts/${id}`, {
        cache: "no-cache",
      });
      const data = await res.json();
      
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };



  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }


  return (
    <PostContext.Provider
      value={{ getPost, posts,users,setUsers, loading, emptyPost, open, handleOpen,handleClose,setPosts}}
    >
      {children}
    </PostContext.Provider>
  );
};
