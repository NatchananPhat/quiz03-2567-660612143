import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { Database, zMessageGetParam } from "@lib/types";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();

  const roomId = request.nextUrl.searchParams.get("roomId");
  const parseResult = zMessageGetParam.safeParse({
    roomId
  });
  if(parseResult.success === false){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  let filtered = (<Database>DB).massages;
  if (roomId !== null) {
    filtered = filtered.filter((r) => r.roomId === roomId);
  }
  return NextResponse.json(
    {
      ok: true,
      messages: filtered,
    }
  );
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const {roomId} = body;
  const getRoomId = (<Database>DB).rooms.find((r) => r.roomId === roomId);
  if(!getRoomId){
    return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
    );
  }

  const messageId = nanoid();
  (<Database>DB).massages.push();
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if(!payload || payload !== "SUPER_ADMIN"){
   return NextResponse.json(
     {
       ok: false,
       message: "Invalid token",
     },
     { status: 401 }
   );
  }

  readDB();
  const body = await request.json();
  const {messageId} = body
  const message = (<Database>DB).massages.findIndex((x) => x.messageId === messageId)
  if(!message){
  return NextResponse.json(
     {
       ok: false,
       message: "Message is not found",
     },
     { status: 404 }
   );
  }

  (<Database>DB).massages.splice(message,1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
