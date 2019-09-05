---
draft: false
title: "Blogging by Gastby"
date: '2019-07-20'
author: Jiang Li 
tags:
  - JavaScript
vssue: false
---

Previously I was blogging using R's BlogDown, which is pretty cool. But recently I used Python more and would 
like to switch to a more general tool. The static site built by Gastby, which is powered by React, is amazingly fast. So I 
decided to give it a try. Here is the workflow of blogging:

1. In the project folder, enter:
`gatsby develop`

2. Add new markdown file in the content/blog. I will prefer to build folder for each post, and compose a index.md inside the folder.

3. To deploy, build the side using `gatsby build` and push the `public` folder to git hub page repo. 



Notes:

- The blog is build based on Gatsby's blog starter. 

- To create the template
`gatsby new my-blog-starter https://github.com/gatsbyjs/gatsby-starter-blog`.

- I added code highlighting and modified the bio. I also want the supports of TOC and math formula, and will add it later.

- Although gatsby has
  `gh-pages` package to publish the site automatically. But I found somehow the github's project page, which is in the 
  `gh-pages` branch, takes a very long time to update. Thus, I still prefer to push the site directly to a repo of page.  


