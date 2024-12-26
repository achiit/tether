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
        // TetherWave: "0xC3eA8E34B056fa334244AB4c6c5DfCa80C490f93",
        TetherWave: "0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C",
    }
}

export type SiteConfig = typeof siteConfig
