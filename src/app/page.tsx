'use client';

import LandingPage from "@/components/landingPage/LandingPage";
import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
export default function Home() {
    return (
        <ClientSessionWrapper>
            <LandingPage/>
        </ClientSessionWrapper>
    );
}
