// .vuepress/config.js

module.exports = {
    // 网站 Title
    title: 'Dynamic Data',

    plugins: [
        ['mathjax', {
            target: 'svg',
            macros: {
                '*': '\\times',
            },
        }],
    ],

    // 网站描述
    description: 'Fun and useful stuff written by Jiang Li',

    // 网站语言
    locales: {
        '/': {
            lang: 'en-US',
        },
    },

    // 使用的主题
    theme: 'meteorlxy',

    // 主题配置
    themeConfig: {
        // 主题语言，参考下方 [主题语言] 章节
        lang: 'en-US',

        // 个人信息（没有或不想设置的，删掉对应字段即可）
        personalInfo: {
            // 昵称
            nickname: 'Jiang Li, Ph.D.',

            // 个人简介
            description: 'Data are dynamic,<br/>just like life.',


            // 所在地
            location: 'Columbus, Ohio',


            // 头像
            // 或者放置在 .vuepress/public 文件夹，例如 .vuepress/public/img/avatar.jpg
            avatar: '/img/profile-pic.jpg',


            // 社交平台帐号信息
            sns: {
                // Github 帐号和链接
                // github: {
                //   account: 'meteorlxy',
                //   link: 'https://github.com/meteorlxy',
                // },


                // LinkedIn 帐号和链接
                linkedin: {
                    account: 'Jiang Li',
                    link: 'https://www.linkedin.com/in/jiang-li-17429558/',
                },

                // Twitter 帐号和链接
                // twitter: {
                //   account: 'meteorlxy_cn',
                //   link: 'https://twitter.com/meteorlxy_cn',
                // },

                // Medium 帐号和链接
                // medium: {
                //   account: 'meteorlxy.cn',
                //   link: 'https://medium.com/@meteorlxy.cn',
                // },


                // GitLab 帐号和链接
                // gitlab: {
                //   account: 'meteorlxy',
                //   link: 'https://gitlab.com/meteorlxy',
                // },

            },
        },

        // 上方 header 的相关设置
        header: {
            // header 的背景，可以使用图片，或者随机变化的图案（geopattern）
            background: {
                // 使用图片的 URL，如果设置了图片 URL，则不会生成随机变化的图案，下面的 useGeo 将失效
                // url: '/assets/img/bg.jpg',

                // 使用随机变化的图案，如果设置为 false，且没有设置图片 URL，将显示为空白背景
                useGeo: true,
            },

            // 是否在 header 显示标题
            showTitle: true,
        },

        // 是否显示文章的最近更新时间
        lastUpdated: true,

        // 顶部导航栏内容
        nav: [
            // { text: 'Home', link: '/', exact: true },
            // { text: 'Posts', link: '/posts/', exact: false },
            //    { text: 'Custom Pages', link: '/custom-pages/', exact: false },
        ],

        // 评论配置，参考下方 [页面评论] 章节
        comments: {
            owner: 'Jiang-Li',
            repo: 'Jiang-Li.github.io',
            clientId: 'MY_CLIENT_ID',
            clientSecret: 'MY_CLIENT_SECRET',
        },

        // 分页配置
        pagination: {
            perPage: 10,
        },

        // 默认页面（可选，默认全为 true）
        defaultPages: {
            // 是否允许主题自动添加 Home 页面 (url: /)
            home: true,
            // 是否允许主题自动添加 Posts 页面 (url: /posts/)
            posts: true,
        },
    },
}