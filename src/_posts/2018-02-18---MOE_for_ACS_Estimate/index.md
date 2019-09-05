---
title: MOE for ACS Estimate
date: '2018-02-18'
author: Jiang Li 
vssue: false
---


There is a moe column in the census data pulled using the
[tidycensus](https://walkerke.github.io/tidycensus/). After doing a mini
research on it, I learned that actually this variable is the 90%
confidence interval for the population mean. Yihui said “Listen / read /
talk and forget; write and remember!”, so I guess it it better to write
down something quickly before I forgot it.

When the population mean, $\mu$, is estimated, it is more meaningful
to use an interval that represents the probable range. Based on the
central limit theorem, the sample mean follows the normal distribution
with mean $\bar x$ and standard deviation $\frac {\sigma}{\sqrt N}$. Thus,
given confidence level, the interval can be estimated by using the
sample mean times the SD and quantile.

For example, when the confidence levels are 80%, 85%, 90%, and 95%, the
corresponding quantiles are:

``` r
c <- seq(0.8, 0.99, 0.05)
round(qnorm(1-(1-c)/2), 3)
```

    ## [1] 1.282 1.440 1.645 1.960

The moe column in the census data is the Margins of Error (MOE), which
is provided for every American Community Survey (ACS) estimate, and is
calculated by:

1.  Get the sample standard deviation
    $s={\sqrt {\frac {\sum_{i=1}^{N}(x_{i}-{\bar {x}})^{2}}{N-1}}}$.
2.  Get the standard error $SE = \frac {S}{\sqrt N}$.
3.  $MOE = 1.645 SE$

Because the quantile is 1.645, so the US Census uses 90% confidence
interval.

The MOE is easily to be converted to other confidence level. For
example, the 95% MOE can be derived using 90% MOE times 1.96/1.645.

To get more details, please reference [Using American Community Survey
(ACS) Estimates and Margins of
Error](https://www.census.gov/programs-surveys/acs/guidance/training-presentations/acs-moe.html)
