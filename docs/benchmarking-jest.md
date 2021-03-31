# Improving Jest test run time

This investigation was started (PTM-46) due to increase jest unit test run times: +10 minutes for ~670 test files.
This was causing the jenkins builds to timeout. I spent some time benchmarking the test suite but also asked DevOps
to increase the size of the slaves running the builds.

## Outcomes:

1. These benchmarks revealed (case 4) that it is tricky to get comparable benchmark metrics. I've not got the time to investigate further.
2. A good starting point for improving the test performance is to look at test setup code as this is setup and destroyed for each `it` test.
3. DevOps have incrased the slaves from m4.large (EC2) to c5.xlarge - which optimises for jests paralell execution model.

## Benchmarks

All tests here use the following cmd:

```
bench 'npm run jest'
```

Note: `bench` can be installed via homebrew: `brew install bench`

### Baseline

```
full-monty (develop) $ bench 'npm run jest'
benchmarking npm run jest
time                 108.9 s    (91.64 s .. 130.6 s)
                     0.995 R²   (0.985 R² .. 1.000 R²)
mean                 104.1 s    (98.43 s .. 107.7 s)
std dev              5.400 s    (0.0 s .. 6.201 s)
variance introduced by outliers: 19% (moderately inflated)
```

### Case 2: Remove `colors` and `nock` from test setup

```
full-monty (develop) $ bench --resamples 5 'npm run jest'
benchmarking npm run jest
time                 97.39 s    (87.51 s .. 97.39 s)
                     0.999 R²   (NaN R² .. 1.000 R²)
mean                 91.99 s    (90.59 s .. 93.38 s)
std dev              3.382 s    (1.447 s .. 3.864 s)
variance introduced by outliers: 19% (moderately inflated)
```

Analysis:
- Note: I've added the `--resamples 5` param to the benchmark runner as the baseline took ages to complete. 5 resamples should give a good enough estimation to work with.
- Average time -10%

### Case 3: Move `mock-local-storage` out from test setup + Case 2

```
full-monty (develop) $ bench --resamples 5 'npm run jest'
benchmarking npm run jest
time                 88.83 s    (88.20 s .. 92.47 s)
                     0.993 R²   (0.990 R² .. 1.000 R²)
mean                 92.96 s    (90.57 s .. 92.96 s)
std dev              3.742 s    (3.142 s .. 3.742 s)
variance introduced by outliers: 19% (moderately inflated)
```

Analysis:
- Average time -18% on baseline
- Want to see case 3 without case 2 to check improvements are consistent

### Case 4: Move `mock-local-storage` out from test setup (without Case 2)

```
full-monty (develop) $ bench --resamples 5 'npm run jest'
benchmarking npm run jest
time                 114.7 s    (99.42 s .. 114.7 s)
                     0.998 R²   (0.996 R² .. 1.000 R²)
mean                 111.4 s    (111.1 s .. 113.2 s)
std dev              2.862 s    (594.9 ms .. 3.113 s)
variance introduced by outliers: 19% (moderately inflated)
```

Analysis:
- This is slower than the baseline. Unclear whether the sample size is too small or something else
