---
title: "Often-used Scripts"
date: '2018-02-06'
description: This is a set of often-used scripts for data wrangling. 
---



I often use R, Python, SAS, SQL, and Bash in different
tasks at the same time. To make the switch between different languages easier, I built a list of the commonly-used script for a quick reference.

A simulated sample data set with missing values and duplicated values was used. 


```r
set.seed(1)
N <- 1000
df <- tibble(
dimension1 = sample(c("I", "II", "III"), N, replace = T),
dimension2 = sample(c("A", "B", "C"), N, replace = T),
measure1 = sample(1:10, N, replace = T),
measure2 = sample(1:10, N, replace = T)
)

df <- as_tibble(lapply(df, 
                       function(r) 
                         r[sample(c(TRUE, NA), 
                                  prob = c(0.85, 0.15), 
                                  size = length(r), 
                                  replace = TRUE)]
                       )
                )

head(df)
```

```
## # A tibble: 6 x 4
##   dimension1 dimension2 measure1 measure2
##   <chr>      <chr>         <int>    <int>
## 1 I          <NA>              7        7
## 2 III        B                 3        8
## 3 I          A                 4       10
## 4 II         <NA>              7        3
## 5 I          A                 9        1
## 6 III        A                10       NA
```


## Row and Column

### R


```r
# row count
nrow(df) 
```

```
## [1] 1000
```

```r
df %>% count()
```

```
## # A tibble: 1 x 1
##       n
##   <int>
## 1  1000
```

```r
# column names
names(df) 
```

```
## [1] "dimension1" "dimension2" "measure1"   "measure2"
```

```r
# data types
lapply(df, class) 
```

```
## $dimension1
## [1] "character"
## 
## $dimension2
## [1] "character"
## 
## $measure1
## [1] "integer"
## 
## $measure2
## [1] "integer"
```


### Python

```python
# row count
df.shape[0]

# column names
list(df) 

# data types
df.dtypes  
```


### SAS
```
PROC CONTENTS DATA=df;
RUN;
```

### SQL

```sql
/* row count */
SELECT COUNT(*) FROM df 

/* column names */
SELECT TOP 0 * FROM df 

/* data types */  
SELECT * FROM INFORMATION_SCHEMA.COLUMNS  
```

### Bash


```bash
# row count
wc -l  filename 

# column names
head -1 filename 
```

## Missing Values

### R


```r
# count missing by columns
colSums(is.na(df)) 
```

```
## dimension1 dimension2   measure1   measure2 
##        163        163        143        156
```

```r
# drop rows with missing
na.omit(df) 
```

```
## # A tibble: 518 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <int>    <int>
##  1 III        B                 3        8
##  2 I          A                 4       10
##  3 I          A                 9        1
##  4 III        A                 8        8
##  5 II         C                 2        9
##  6 III        C                 7        1
##  7 I          A                 9        6
##  8 I          A                 2        4
##  9 II         A                 1        9
## 10 I          B                 9        2
## # … with 508 more rows
```

```r
# drop rows with all missing
df[rowSums(!is.na(df)) > 0, ] 
```

```
## # A tibble: 1,000 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <int>    <int>
##  1 I          <NA>              7        7
##  2 III        B                 3        8
##  3 I          A                 4       10
##  4 II         <NA>              7        3
##  5 I          A                 9        1
##  6 III        A                10       NA
##  7 III        A                 8        8
##  8 <NA>       C                 2        7
##  9 II         C                 2        9
## 10 III        C                 7        1
## # … with 990 more rows
```

```r
# drop columns with all missing
df[colSums(!is.na(df)) > 0]
```

```
## # A tibble: 1,000 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <int>    <int>
##  1 I          <NA>              7        7
##  2 III        B                 3        8
##  3 I          A                 4       10
##  4 II         <NA>              7        3
##  5 I          A                 9        1
##  6 III        A                10       NA
##  7 III        A                 8        8
##  8 <NA>       C                 2        7
##  9 II         C                 2        9
## 10 III        C                 7        1
## # … with 990 more rows
```


```r
# fill all missing by 0
df %>% replace(., is.na(.), 0)
```

```
## # A tibble: 1,000 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <dbl>    <dbl>
##  1 I          0                 7        7
##  2 III        B                 3        8
##  3 I          A                 4       10
##  4 II         0                 7        3
##  5 I          A                 9        1
##  6 III        A                10        0
##  7 III        A                 8        8
##  8 0          C                 2        7
##  9 II         C                 2        9
## 10 III        C                 7        1
## # … with 990 more rows
```

```r
# fill missing by columns
df %>% replace_na(list(dimension1 = "Unknown", measure1 = 0)) 
```

```
## # A tibble: 1,000 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <dbl>    <int>
##  1 I          <NA>              7        7
##  2 III        B                 3        8
##  3 I          A                 4       10
##  4 II         <NA>              7        3
##  5 I          A                 9        1
##  6 III        A                10       NA
##  7 III        A                 8        8
##  8 Unknown    C                 2        7
##  9 II         C                 2        9
## 10 III        C                 7        1
## # … with 990 more rows
```

### Python


```python
# count missing by columns
df.isnull().sum()

# drop any missing
df.dropna() 

# drop rows with all missing
df.dropna(how="all") 

# drop columns with all missing
df.dropna(axis=1, how='all') 

# fill all missing by 0
df.fillna(0)

# fill missing by columns
df.fillna(value = {"dimension1": "Unknown", "measure1": 0})
```


## Unique

### R


```r
# unique row
df %>% distinct()
```

```
## # A tibble: 766 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <int>    <int>
##  1 I          <NA>              7        7
##  2 III        B                 3        8
##  3 I          A                 4       10
##  4 II         <NA>              7        3
##  5 I          A                 9        1
##  6 III        A                10       NA
##  7 III        A                 8        8
##  8 <NA>       C                 2        7
##  9 II         C                 2        9
## 10 III        C                 7        1
## # … with 756 more rows
```

```r
# unique row by columns
df %>% distinct(dimension1, dimension2, .keep_all = T)
```

```
## # A tibble: 16 x 4
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <int>    <int>
##  1 I          <NA>              7        7
##  2 III        B                 3        8
##  3 I          A                 4       10
##  4 II         <NA>              7        3
##  5 III        A                10       NA
##  6 <NA>       C                 2        7
##  7 II         C                 2        9
##  8 III        C                 7        1
##  9 III        <NA>              5        4
## 10 I          C                NA       10
## 11 II         A                 1        9
## 12 II         B                NA        2
## 13 <NA>       A                 8       10
## 14 I          B                 9        2
## 15 <NA>       B                 9        4
## 16 <NA>       <NA>              6       NA
```

### Python


```python
# unique row
df.drop_duplicates()

# unique row by columns
df.drop_duplicates(subset=('dimension1', 'dimension2'))
```

## Level Count

### R


```r
# distribution
table(df$dimension1)
```

```
## 
##   I  II III 
## 295 275 267
```

```r
# contingency table
table(df$dimension1, df$dimension2)
```

```
##      
##        A  B  C
##   I   89 80 79
##   II  71 89 70
##   III 75 66 86
```

### Python


```python
# distribution
df.dimension1.value_counts()

# contingency table
pd.crosstab(df.dimension1, df.dimension2)
```


## Summary

### R


```r
# summarize the total, percent, ratio, and ratio

df %>% 
  group_by(dimension1) %>% 
  summarise(
    measure1 = sum(measure1, na.rm = T),
    measure2 = sum(measure2, na.rm = T),
    count = n()
  ) %>% 
  mutate(
    measure1_percent = measure1/sum(measure1),
    ratio = measure1/measure2
  ) %>% 
  mutate(
    ratio_relativity = ratio/(sum(measure1)/sum(measure2))
  )
```

```
## # A tibble: 4 x 7
##   dimension1 measure1 measure2 count measure1_percent ratio
##   <chr>         <int>    <int> <int>            <dbl> <dbl>
## 1 <NA>            749      752   163            0.157 0.996
## 2 I              1480     1460   295            0.311 1.01 
## 3 II             1288     1261   275            0.271 1.02 
## 4 III            1244     1320   267            0.261 0.942
## # … with 1 more variable: ratio_relativity <dbl>
```

### Python


```python
# summarize the total, percent, ratio, and relativity
def oneway(g):
  return(
    pd.Series({
      "measure1": g.measure1.sum(),
      "measure2": g.measure2.sum(),
      "count": len(g),
      "measure1_percent": g.measure1.sum()/df.measure1.sum(),
      "ratio": g.measure1.sum()/g.measure2.sum(),
      "ratio_relativity":
        (g.measure1.sum()/g.measure2.sum())/ 
        (df.measure1.sum()/df.measure2.sum())
    })
  )
  
df.groupby("dimension1").apply(oneway)
```


## Merge

### R


```r
# join tables with different key names
df2 <- df %>%
  group_by(dimension1, dimension2) %>%
  summarise(
    measure3 = sum(measure1, na.rm = T),
    measure4 = sum(measure2, na.rm = T)
  ) %>%
  rename(dimension3 = dimension1, dimension4 = dimension2)

left_join(df, df2,
  by = c(
    "dimension1" = "dimension3",
    "dimension2" = "dimension4"
  )
)
```

```
## # A tibble: 1,000 x 6
##    dimension1 dimension2 measure1 measure2 measure3 measure4
##    <chr>      <chr>         <int>    <int>    <int>    <int>
##  1 I          <NA>              7        7      229      195
##  2 III        B                 3        8      314      337
##  3 I          A                 4       10      461      480
##  4 II         <NA>              7        3      226      180
##  5 I          A                 9        1      461      480
##  6 III        A                10       NA      353      356
##  7 III        A                 8        8      353      356
##  8 <NA>       C                 2        7      206      226
##  9 II         C                 2        9      340      333
## 10 III        C                 7        1      386      442
## # … with 990 more rows
```

### Python


```python
# join tables with different key names
pd.merge(df, df2,
  how="left", 
  left_on=["dimesnion1", "dimesnion2"],
  right_on=["dimesnion3", "dimesnion4"]
)
```

## Reshape

### R


```r
# wide to long
df_reshape <- df %>% gather(c("measure1", "measure2"), 
                            key = "measure", value = "values")

# long to wide: the value must be unqiue by other variales
df_reshape %>%
  group_by(dimension1, dimension2, measure) %>%
  summarise(values = sum(values, na.rm = T)) %>% 
  spread(key = measure, value = values)
```

```
## # A tibble: 16 x 4
## # Groups:   dimension1, dimension2 [16]
##    dimension1 dimension2 measure1 measure2
##    <chr>      <chr>         <int>    <int>
##  1 I          A               461      480
##  2 I          B               392      426
##  3 I          C               398      359
##  4 I          <NA>            229      195
##  5 II         A               282      358
##  6 II         B               440      390
##  7 II         C               340      333
##  8 II         <NA>            226      180
##  9 III        A               353      356
## 10 III        B               314      337
## 11 III        C               386      442
## 12 III        <NA>            191      185
## 13 <NA>       A               178      206
## 14 <NA>       B               209      206
## 15 <NA>       C               206      226
## 16 <NA>       <NA>            156      114
```

### Python


```python
df_reshape = pd.melt(df,
                     id_vars=['dimension1', 'dimension2'],
                     value_vars=['measure1', 'measure2'])

(df_reshape.groupby(['dimension1', 'dimension2', 'variable'],
                    as_index=False)
           .value.sum()
           .pivot_table(index=['dimension1', 'dimension2'],
                        columns='variable', values='value'))
```
