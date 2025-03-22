'use client';

import Navbar from "@/components/navbar/Navbar";
import EditDeleteEntry from "@/components/entry/EditDeleteEntry";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function ReadEntryPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <EditDeleteEntry/>
        </>
    );
}
