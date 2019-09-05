---
title: "R + H2O for Insurance Rating"
date: '2018-02-25'
author: Jiang Li 
tags:
  - R
vssue: false
---

Insurance rating models predict risk, which is usually represented by
pure premium; i.e., the loss normalized by the covered time (exposure)
$\\frac {loss}{exposure}$. GLM (Generalized Linear Model) is the major
method using in industry. Insurance data are highly imbalanced. When the
data are not credible enough, pure premium is predicted by frequency
$\\frac {claimCount}{coveredTime}$ and severity
$\\frac {loss}{claimCount}$, respectively, because the frequency is more
credible.

Here I would like to show how to predict pure premium using frequency
and severity in R and H2O - transitioning away from the industry
standard of SAS without any loss in model accuracy.

Data and Methods
----------------

The data set is the dataCar in insuranceDate library. I used the
following explanatory variables:

| variables  | note                                                             |
|------------|------------------------------------------------------------------|
| veh\_value | in $10k unit; an approximation of vehicle symbol                 |
| exposure   | in 0\~1; probably earned car year                                |
| numclaims  | claim count                                                      |
| claimcst0  | loss amount                                                      |
| veh\_body  | body type, a categorical variable                                |
| veh\_age   | age of vehicle                                                   |
| gender     | a categorical veritable                                          |
| area       | a categorical variable; an approximation of the territory agecat |

``` r
str(dataCar)
```

    ## 'data.frame':    67856 obs. of  11 variables:
    ##  $ veh_value: num  1.06 1.03 3.26 4.14 0.72 2.01 1.6 1.47 0.52 0.38 ...
    ##  $ exposure : num  0.304 0.649 0.569 0.318 0.649 ...
    ##  $ clm      : int  0 0 0 0 0 0 0 0 0 0 ...
    ##  $ numclaims: int  0 0 0 0 0 0 0 0 0 0 ...
    ##  $ claimcst0: num  0 0 0 0 0 0 0 0 0 0 ...
    ##  $ veh_body : Factor w/ 13 levels "BUS","CONVT",..: 4 4 13 11 4 5 8 4 4 4 ...
    ##  $ veh_age  : int  3 2 2 2 4 3 3 2 4 4 ...
    ##  $ gender   : Factor w/ 2 levels "F","M": 1 1 1 1 1 2 2 2 1 1 ...
    ##  $ area     : Factor w/ 6 levels "A","B","C","D",..: 3 1 5 4 3 3 1 2 1 2 ...
    ##  $ agecat   : int  2 4 2 2 2 4 4 6 3 4 ...
    ##  $ X_OBSTAT_: Factor w/ 1 level "01101    0    0    0": 1 1 1 1 1 1 1 1 1 1 ...

Modeling
--------

Usually the insurance data set is big. To make the the code to be easily
scaled up, I used the H2O.

``` r
library(h2o)

h2o.init(
  nthreads = -1,
  max_mem_size = "4G"
)
```

    ## 
    ## H2O is not running yet, starting it now...
    ## 
    ## Note:  In case of errors look at the following log files:
    ##     /var/folders/v9/8nb0m5bd77n3l_yp73p7fcz00000gn/T//RtmpgcRE3P/h2o_jli_started_from_r.out
    ##     /var/folders/v9/8nb0m5bd77n3l_yp73p7fcz00000gn/T//RtmpgcRE3P/h2o_jli_started_from_r.err
    ## 
    ## 
    ## Starting H2O JVM and connecting: .. Connection successful!
    ## 
    ## R is connected to the H2O cluster: 
    ##     H2O cluster uptime:         1 seconds 773 milliseconds 
    ##     H2O cluster timezone:       America/New_York 
    ##     H2O data parsing timezone:  UTC 
    ##     H2O cluster version:        3.24.0.3 
    ##     H2O cluster version age:    2 months and 13 days  
    ##     H2O cluster name:           H2O_started_from_R_jli_kbx801 
    ##     H2O cluster total nodes:    1 
    ##     H2O cluster total memory:   4.00 GB 
    ##     H2O cluster total cores:    12 
    ##     H2O cluster allowed cores:  12 
    ##     H2O cluster healthy:        TRUE 
    ##     H2O Connection ip:          localhost 
    ##     H2O Connection port:        54321 
    ##     H2O Connection proxy:       NA 
    ##     H2O Internal Security:      FALSE 
    ##     H2O API Extensions:         Amazon S3, XGBoost, Algos, AutoML, Core V3, Core V4 
    ##     R Version:                  R version 3.6.0 (2019-04-26)

``` r
h2o.no_progress()

df <- as.h2o(dataCar)
```

``` r
varList <- c(
  "veh_value",
  "exposure",
  "numclaims",
  "claimcst0",
  "veh_body",
  "veh_age",
  "gender",
  "area",
  "agecat"
)
df <- df[, varList]
df$PP <- df$claimcst0 / df$exposure

# the features used in modeling
varModel <- c(
  "veh_value",
  "veh_body",
  "veh_age",
  "gender",
  "area",
  "agecat"
)

df$frequency <- df$numclaims / df$exposure
df$severity <- df$claimcst0 / df$numclaims

print("Percentage of missing values in frequency and severity:")
```

    ## [1] "Percentage of missing values in frequency and severity:"

``` r
percent(h2o.sum(is.na(df$frequency)) / nrow(df))
```

    ## [1] "0%"

``` r
percent(h2o.sum(is.na(df$severity)) / nrow(df))
```

    ## [1] "93.2%"

``` r
# The sample data set is too small. I did not split them to train and test.
train <- df
test <- df
```

First, frequency is modeled. Please note that the Poisson distribution
requires a whole number as the response variable, so exposure, the
denominator of frequency, is treated by the offset.

``` r
train$logExp <- h2o.log(train$exposure) # offset

freqFit = h2o.glm(y = "numclaims",
                  x = varModel,
                  training_frame = train,
                  offset_column = "logExp",
                  family = "poisson",
                  link = "log",
                  missing_values_handling = "Skip",
                  solver = "IRLSM",
                  lambda = 0,
                  remove_collinear_columns = T,
                  compute_p_values = T
)
```

Then, severity is modeled.

``` r
sevFit = h2o.glm(y = "severity",
                 x = varModel,
                 training_frame = train,
                 family = "gamma",
                 link = "log",
                 missing_values_handling = "Skip",
                 solver = "IRLSM",
                 lambda = 0,
                 remove_collinear_columns = T,
                 compute_p_values = T
)
```

Output
------

The predicted pure premium was calculated using the frequency and
severity factors.

``` r
library(dplyr)
```

    ## 
    ## Attaching package: 'dplyr'

    ## The following objects are masked from 'package:stats':
    ## 
    ##     filter, lag

    ## The following objects are masked from 'package:base':
    ## 
    ##     intersect, setdiff, setequal, union

``` r
summaryFactorGLM <- function(fitModles) {
  # Summarize the factors.
  #
  # Args:
  #  fitModles: list of h2o modles: frequency and severity
  #
  # Returns:
  #   A data frame of the combined factor table.

  freqFit <- fitModles[["frequency"]]
  sevFit <- fitModles[["severity"]]

  freqCoef <- as.data.frame(freqFit@model$coefficients_table)
  freqCoef[freqCoef$names == "Intercept", "names"] <- "freqIntercept"

  freqCoef <- freqCoef %>%
    mutate(
      frequencyFactor = exp(coefficients)
    ) %>%
    select(
      names,
      frequencyFactor,
      frequencyEstimate = coefficients
    )

  sevCoef <- sevFit@model$coefficients_table

  sevCoef[sevCoef$names == "Intercept", "names"] <- "sevIntercept"

  sevCoef <- sevCoef %>%
    mutate(
      severityFactor = exp(coefficients)
    ) %>%
    select(
      names,
      severityFactor,
      severityEstimate = coefficients
    )

  # pure premium
  ppCoef <- full_join(freqCoef, sevCoef, by = "names")

  ppCoef$factor <- ppCoef$frequencyFactor * ppCoef$severityFactor

  # assign the factor of intercept
  ppCoef[ppCoef$names == "sevIntercept", "factor"] <-
    ppCoef[ppCoef$names == "sevIntercept", "severityFactor"]
  ppCoef[ppCoef$names == "freqIntercept", "factor"] <-
    ppCoef[ppCoef$names == "freqIntercept", "frequencyFactor"]

  # seperate the parameter and level, remove the intercept
  ppCoef$parameter <- sapply(strsplit(ppCoef$names, "\\."), "[", 1)
  ppCoef$level <- sapply(strsplit(ppCoef$names, "\\."), "[", 2)
  ppCoef$names <- NULL


  return(ppCoef)
}


factorDF <-
  summaryFactorGLM(list(frequency = freqFit, severity = sevFit)) %>% 
  select(parameter, level, factor)

factorDF
```

    ##        parameter level      factor
    ## 1  freqIntercept  <NA>   0.5876642
    ## 2       veh_body CONVT   0.3806982
    ## 3       veh_body COUPE   1.2143005
    ## 4       veh_body HBACK   0.6928246
    ## 5       veh_body HDTOP   0.7027602
    ## 6       veh_body MCARA   0.3644400
    ## 7       veh_body MIBUS   0.8020327
    ## 8       veh_body PANVN   0.7423515
    ## 9       veh_body RDSTR   0.2057272
    ## 10      veh_body SEDAN   0.6260212
    ## 11      veh_body STNWG   0.6034189
    ## 12      veh_body TRUCK   0.7260584
    ## 13      veh_body   UTE   0.5364956
    ## 14          area     B   1.0274201
    ## 15          area     C   1.1034716
    ## 16          area     D   0.8772347
    ## 17          area     E   1.1580586
    ## 18          area     F   1.5895192
    ## 19        gender     M   1.1775373
    ## 20     veh_value  <NA>   1.0521231
    ## 21       veh_age  <NA>   1.0121147
    ## 22        agecat  <NA>   0.8625939
    ## 23  sevIntercept  <NA> 986.5646388
