import { type NextRequest } from "next/server";
import { updateSession } from "./lib/utils/supabase/proxy";

export async function proxy(req: NextRequest) {
    return await updateSession(req);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};