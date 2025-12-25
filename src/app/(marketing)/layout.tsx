"use client";

import SmoothScroll from "@/components/layout/SmoothScroll";

import ScrollManager from "@/components/utils/ScrollManager";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ScrollManager>
            <div className="relative flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
            </div>
        </ScrollManager>
    );
}
