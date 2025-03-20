'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import EditDeleteEntry from "@/components/entry/EditDeleteEntry";

export default function ReadEntryPage() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <EditDeleteEntry/>
        </ClientSessionWrapper>
    );
}
