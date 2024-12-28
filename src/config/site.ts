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
        Royalty: "0x16fdab4662496e8EAD6856D4E97AB32D385dBb72",
    }
}

export type SiteConfig = typeof siteConfig
