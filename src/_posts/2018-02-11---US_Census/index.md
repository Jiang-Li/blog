---
title: Know More about the Place You Live Using Census Data
date: '2018-02-11'
author: Jiang Li 
tags:
  - R 
vssue: false
---
## Where the story is from 

Until 2018 I have lived in Columbus Metropolitan area for more than ten years. How time flies! In these years I feel more and more vehicles on the road. No doubt this area is growing fast. However, almost all my quantitative understanding of Columbus is from Wiki...It is not bad, but what if I want to know more? 

When I was in the 2018 RStudio Conference (a very good meeting in the R field, highly recommended), an elegant lady, who is a senior data scientist working for US government, told me that census data can be easily consumed using R. Then, why not use R to know more about the place I live?

## How to get Census data

First, get US Cencus key: https://api.census.gov/data/key_signup.html

Then, load packages and set the option.
```r
library(tidycensus)
library(mapview)

options(tigris_use_cache = TRUE)

```

After that, active the key by
```r
census_api_key(your key, install = T, overwrite = T)
```

```r
census_api_key("37c38f3d2e15304bd682b2fb6da6dd87df896430",
               install = T,
               overwrite = T)

```


### How about the household income?
```r
df <- get_acs(geography = "tract",
              variables = "B19013_001",
              state = "OH",
              county = "Franklin",
              geometry = TRUE)
```

```r
mapview(df, zcol = "estimate", legend = TRUE)
```
