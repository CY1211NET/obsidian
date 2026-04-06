import { Github, Twitter, Linkedin, Mail, Youtube, MessageCircle, MessageSquare } from 'lucide-react';

import { WeChatIcon, QQIcon } from './components/CustomIcons';

const basePath = '';

export const siteConfig = {
    author: {
        name: "Crian",
        avatar: `${basePath}/imgs/headshots.png`,
        zh: {
            bio: "我开始记录我的一切",
            location: "南昌",
        },
        en: {
            bio: "I started recording everything about me.",
            location: "Nanchang",
        }
    },
    home: {
        profileImages: [
            "https://i.cetsteam.com/imgs/2026/04/06/298af323052fbf7e.jpg",
            "https://i.cetsteam.com/imgs/2026/04/06/3d83c11ebd919661.jpg",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000",
        ],
        zh: {
            title: "我开始记录我的一切",
            subtitle: "拍摄于 @ 南昌,厦门"
        },
        en: {
            title: "I started recording everything about me",
            subtitle: "Shot @ Nanchang, Xiamen"
        }
    },
    about: {
        profileImage: "https://i.cetsteam.com/imgs/2026/04/06/fa18023ebe0c233c.jpg",
        zh: {
            title: "永远在学习着一切，欢迎指教 拍摄于@深圳",
            description: "如果再也见不到你，那么祝你早安，午安，晚安-《楚门的世界》",
            sections: [
                {
                    label: "爱好",
                    content: "摄影（喜欢拍上一些乱七八糟的），阅读：《活着》，《恶意》，《三体》，《局外人》，《龙族》，《查理九世》，电影：《盗梦空间》，《星际穿越》，《烈日灼心》，《霸王别姬》，《楚门的世界》还有很多欢迎了解 "
                },
                {
                    label: "个人性格",
                    content: "ENTP,喜欢探索未知，对一切充满好奇，也缺少对于自己的鞭策，有时候做到一半的事会放弃，我想我应该改进的。"
                },
                {
                    label: "希望",
                    content: "希望自己能够坚持做自己喜欢的事情"
                }
            ],
            contact: {
                title: "找到我",
                description: "如果你有什么问题或者想法欢迎联系我，我很乐意参与其中",
                email: "y252840@163.com"
            }
        },
        en: {
            title: "Always learning, open to guidance. Shot @Shenzhen",
            description: "In case I don't see ya, good afternoon, good evening, and good night - The Truman Show",
            sections: [
                {
                    label: "Hobbies",
                    content: "Photography (capturing random moments), Reading: To Live, Malice, The Three-Body Problem, The Stranger, Dragon Raja, Charlie IX; Movies: Inception, Interstellar, The Dead End, Farewell My Concubine, The Truman Show, and many more to share."
                },
                {
                    label: "Personality",
                    content: "ENTP. Love exploring the unknown, curious about everything, though sometimes lacking self-discipline and leaving things half-done. It's something I want to improve."
                },
                {
                    label: "Hope",
                    content: "I hope to always keep doing the things I love."
                }
            ],
            contact: {
                title: "Get in touch",
                description: "If you have any questions or ideas, feel free to reach out. I'd love to get involved.",
                email: "y252840@163.com"
            }
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
            icon: WeChatIcon,
            qrCode: `${basePath}/imgs/wechat.png`,
            tooltip: "CYOUNG1211",
        },
        {
            name: "QQ",
            url: "#",
            icon: QQIcon,
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
    ui: {
        zh: {
            nav: { home: "首页", timeline: "历程", about: "关于" },
            home: { tags: "热门标签", categories: "文章分类", readMore: "阅读全文", all: "全部", noResults: "未找到相关文章" },
            timeline: { 
                title: "时光印记", 
                subtitle: "每一次记录都有它的意义",
                summary: {
                    total: "年度发布",
                    maxMonth: "最高产月",
                    topCat: "最热分类",
                    topTag: "最热标签",
                    first: "开篇之作",
                    last: "年底收官"
                }
            },
            post: {
                drawer: {
                    titleTag: "标签探索",
                    titleCat: "专栏分类",
                    related: "这儿有几篇相关的文章",
                    noPosts: "暂无其他相关文章",
                    readTime: "分钟阅读"
                }
            },
            search: "搜索文章标题、标签或描述..."
        },
        en: {
            nav: { home: "Home", timeline: "Timeline", about: "About" },
            home: { tags: "Tags", categories: "Categories", readMore: "Read More", all: "All", noResults: "No posts found" },
            timeline: { 
                title: "Timeline", 
                subtitle: "Every record has its meaning",
                summary: {
                    total: "Total Posts",
                    maxMonth: "Top Month",
                    topCat: "Top Category",
                    topTag: "Top Tag",
                    first: "First Entry",
                    last: "Latest Entry"
                }
            },
            post: {
                drawer: {
                    titleTag: "Tag Discover",
                    titleCat: "Category",
                    related: "Here are some related posts",
                    noPosts: "No other related posts found",
                    readTime: "min read"
                }
            },
            search: "Search by title, tags or description..."
        }
    },
    music: {
        // 默认音乐播放配置
        defaultPlaylistId: "13426872452",
        // 多歌单配置：您可以在这里随意替换为自己的网易云歌单 ID 和名称
        playlists: [
            { id: "13426872452", name: "个人歌单" },
            { id: "7930689090", name: "很喜欢的几首歌" }

        ]
    }
};
