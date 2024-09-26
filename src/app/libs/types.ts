import { z } from "zod";

export interface Room {
    roomId: string;
    roomName: string;
  }
  
  export interface Message {
    roomId: string;
    messageId: string;
    messageText: string;
  }
  
  export interface User {
    username: string;
    password: string;
    role: "ADMIN" | "SUPER_ADMIN";
  }
  
  export interface Database {
    rooms: Room[];
    massages: Message[];
    users: User[];
  }

  const zroomId = z.string();
  const zmessageId = z.string();
  const zmessageText = z.string();

  export const zMessageGetParam = z.object({
    roomId: zroomId,
    messageId: zmessageId,
    messageText: zmessageText,
  });