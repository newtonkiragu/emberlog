"use client";

import {SessionProvider} from "next-auth/react";
import {ReactNode} from "react";

export function ClientSessionWrapper({children}: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}