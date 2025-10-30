import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Print to the dev server terminal so measurements can be inspected during development
    console.log("DEBUG_MEASURE:", JSON.stringify(data));
  } catch (err) {
    console.log("DEBUG_MEASURE parse error", err);
  }
  return NextResponse.json({ ok: true });
}
