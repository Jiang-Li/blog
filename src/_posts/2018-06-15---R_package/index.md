---
title: Workflow of Building R Package
date: '2018-06-15'
author: Jiang Li 
tags:
  - R
vssue: false
---

Thanks to RStudio and the *usethis* and *ROxygen* packages, the building
of a R package is much convenient. Here is a typical workflow:

1.  Initialize the project of package

<!-- -->

    usethis::create_package("...")

1.  Modify the description
2.  Copy and save R code in the /R folder
3.  Build -&gt; Load All
4.  Remove the library(…) in the code, and add the packages by

<!-- -->

    usethis::use_package("...")

1.  Build -&gt; Check
2.  Write help for each function: Code -&gt; Insert ROxygen Skeleton
3.  Assign the other packages’ functions using in the code

<!-- -->

      @importFrom package function1, function2...

1.  Build -&gt; Documents
2.  usethis::use\_readme\_md()
3.  Build -&gt; build binary

Done!
