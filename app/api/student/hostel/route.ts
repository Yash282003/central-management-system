import { NextResponse } from "next/server";
import { ConnectDb } from "@/helper/db";
import { Hostel } from "@/models/Hostel";

export async function GET() {
  await ConnectDb();

  const student = await Hostel.findOne(); 

  return NextResponse.json(student);
}