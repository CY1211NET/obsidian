import { Github, Twitter, Linkedin, Mail, Youtube, MessageCircle, MessageSquare } from 'lucide-react';

// 如果你以后换了网址有子路径再设置 basePath，现在在 Cloudflare 根目录不用设置：
const basePath = '';

export const siteConfig = {
    author: {
        name: "NEXUS_ADMIN",
        bio: "Digital architect exploring the boundaries of the void. Specializing in cybernetic interfaces and neural networks.",
        bio_zh: "探索虚空边界的数字架构师。专注于控制论接口和神经网络。",
        avatar: `${basePath}/imgs/mmexport1762949235080.png`,
        location: "Neo-Tokyo, Sector 7",
    },
    socials: [
        {
            name: "GitHub",
            url: "https://github.com/CY1211NET",
            icon: Github,
        },
        {
            name: "Email",
            url: "mailto:y252840@163.com",
            icon: Mail,
        },
        {
            name: "Twitter",
            url: "https://x.com/chny70791654",
            icon: Twitter,
        },
        {
            name: "WeChat",
            url: "#",
            icon: MessageCircle,
            qrCode: `${basePath}/imgs/mmqrcode1764071303278.png`,
        },
        {
            name: "QQ",
            url: "#",
            icon: MessageSquare,
            qrCode: `${basePath}/imgs/Image_1764071428006.png`,
        },
    ],
    friends: [
        {
            name: "叶子的blog",
            url: "https://blog.oksanye.com/",
            description: "这是我的好朋友，请点击传送门去到他的世界",
            avatar: `${basePath}/avatar-placeholder.jpg`,
        },
    ],
};
