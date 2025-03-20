'use client';

import Landing from "@/components/landingPage/Landing";
import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import {Footer} from "@/components/footer/Footer";

export default function Home() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <Landing/>
            <Footer/>
        </ClientSessionWrapper>
    );
}
