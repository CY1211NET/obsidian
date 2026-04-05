import { Github, Twitter, Linkedin, Mail, Youtube, MessageCircle, MessageSquare } from 'lucide-react';

const basePath = '';

export const siteConfig = {
    author: {
        name: "Crian",
        bio: "Digital architect exploring the boundaries of the void. Specializing in cybernetic interfaces and neural networks.",
        bio_zh: "我开始记录我的一切",
        avatar: `${basePath}/imgs/headshots.png`,
        location: "南昌",
    },
    home: {
        title: "我开始记录我的一切",
        subtitle: "拍摄于 @ 南昌",
        profileImages: [
            "https://i.cetsteam.com/imgs/2026/04/06/298af323052fbf7e.jpg",
            "https://i.cetsteam.com/imgs/2026/04/06/3d83c11ebd919661.jpg",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000",
        ],
    },
    about: {
        title: "永远在学习着一切，欢迎指教",
        description: "如果再也见不到你，那么祝你早安，午安，晚安",
        profileImage: "https://i.cetsteam.com/imgs/2026/04/06/3d83c11ebd919661.jpg",
        sections: [
            {
                label: "爱好",
                content: "摄影，阅读，开发"
            },
            {
                label: "FOCUS",
                content: "Design Systems, Performance, Accessibility, and User Experience."
            },
            {
                label: "LOCATION",
                content: "Based in the digital ether, exploring new frontiers."
            }
        ],
        contact: {
            title: "Get in touch",
            description: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.",
            email: "y252840@163.com"
        }
    },
    socials: [
        {
            name: "GitHub",
            url: "https://github.com/CY1211NET",
            icon: Github,
            tooltip: "https://github.com/CY1211NET",
        },
        {
            name: "Email",
            url: "mailto:y252840@163.com",
            icon: Mail,
            tooltip: "y252840@163.com",
        },
        {
            name: "Twitter",
            url: "https://x.com/chny70791654",
            icon: Twitter,
            tooltip: "https://x.com/chny70791654"
        },
        {
            name: "WeChat",
            url: "",
            icon: MessageCircle,
            qrCode: `${basePath}/imgs/wechat.png`,
            tooltip: "CYOUNG1211",
        },
        {
            name: "QQ",
            url: "#",
            icon: MessageSquare,
            qrCode: `${basePath}/imgs/qq.png`,
            tooltip: "2528408720",
        },
    ],
    friends: [
        {
            name: "叶子的blog",
            url: "https://blog.oksanye.com/",
            description: "这是我的好朋友，请点击传送门去到他的世界",
            avatar: `${basePath}/imgs/headshots.png`,
        },
    ],
};
