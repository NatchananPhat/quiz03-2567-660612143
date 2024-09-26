import { DB, readDB, writeDB } from "@lib/DB";
import { Database } from "@lib/types";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const rooms = (<Database>DB).rooms;
  const totalRooms = rooms.length;
  readDB();
  return NextResponse.json({
    ok: true,
    //rooms:
    rooms,
    //totalRooms:
    totalRooms,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
     { status: 401 }
    );
  }

  readDB();
  const body = await request.json()
  const { roomName } = body;
  const GetRoom = (<Database>DB).rooms.find((r) => r.roomName === roomName);
  if(GetRoom){
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  (<Database>DB).rooms.push({roomId,roomName})

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    //roomId,
    message: `Room ${roomName} has been created`,
  });
};
