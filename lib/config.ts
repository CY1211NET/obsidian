import { Github, Twitter, Linkedin, Mail, Youtube } from 'lucide-react';

export const siteConfig = {
    author: {
        name: "NEXUS_ADMIN",
        bio: "Digital architect exploring the boundaries of the void. Specializing in cybernetic interfaces and neural networks.",
        avatar: "/avatar-placeholder.jpg", // You can replace this with a real image path
        location: "Neo-Tokyo, Sector 7",
    },
    socials: [
        {
            name: "GitHub",
            url: "https://github.com",
            icon: Github,
        },
        {
            name: "Twitter",
            url: "https://twitter.com",
            icon: Twitter,
        },
        {
            name: "Bilibili",
            url: "https://bilibili.com",
            icon: Youtube, // Using Youtube icon as placeholder for Bilibili
        },
        {
            name: "Email",
            url: "mailto:admin@nexus.log",
            icon: Mail,
        },
    ],
    friends: [
        {
            name: "Cyber_Drifter",
            url: "https://example.com",
            description: "Wandering the digital wasteland.",
            avatar: "/avatars/friend1.jpg",
        },
        {
            name: "Neon_Samurai",
            url: "https://example.com",
            description: "Slicing through firewalls.",
            avatar: "/avatars/friend2.jpg",
        },
        {
            name: "Void_Walker",
            url: "https://example.com",
            description: "Exploring the deep web.",
            avatar: "/avatars/friend3.jpg",
        },
    ],
};
