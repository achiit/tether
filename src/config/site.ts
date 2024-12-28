export const siteConfig = {
    name: "Tether Ventures",
    description: "Building Networks, Growing Wealth Together",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Dashboard",
            href: "/dashboard",
        },
    ],
    links: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
    },
    contracts: {
        USDT: "0xe6Ad72C499ce626b10De645E25BbAb40C5A34C9f",
        TetherWave: "0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C",
        Royalty: "0x5B93c93E38a4EeE9Be2EBb648BA210DEaD6e2395",
    }
}

export type SiteConfig = typeof siteConfig
