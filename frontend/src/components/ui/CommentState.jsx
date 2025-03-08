import { createContext, useState } from "react";

export const CommentState = createContext();

export const CommentProvider = ({ children }) => {
  const [commentStatus, setCommentStatus] = useState(false);

  return (
    <CommentState.Provider value={{ commentStatus, setCommentStatus }}>
      {children}
    </CommentState.Provider>
  );
};