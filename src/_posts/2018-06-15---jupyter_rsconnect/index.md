---
title: Jupyter Notebook in RStudio Connect
date: '2018-06-15'
author: Jiang Li
vssue: false
---

The [RStudio Connect](https://www.rstudio.com/products/connect/) is a
handy tool to publish a report online and share with the team. Usually,
the Markdown, R Markdown, or R Notebook documents can be easily
previewed and published in RStudio. However, what if I want to publish a
report composed by Jupyter Notebook?

The idea is to convert the Jupyter Notebook to Markdown. Here is how:

1.  Given a sample.ipynb, convert it to markdown file by:
    `jupyter nbconvert --to markdown sample.ipynb`
2.  Remove the leading spaces by `sed "s/^[ \t]*//" -i sample.md`
3.  Load the markdown fine in RStudio, Preview, and publish it.

That’s it!

