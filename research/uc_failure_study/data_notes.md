# Data notes

## Selected dataset

The first public dataset is **GEO GSE14580**, titled “Mucosal gene signatures to predict response to infliximab in patients with ulcerative colitis.” The GEO record describes 24 patients with active UC who were refractory to corticosteroids and/or immunosuppression, sampled from diseased colonic mucosa within one week before first infliximab treatment. Response was defined by endoscopic and histologic healing at 4–6 weeks. Six control samples are also included. [GEO record](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE14580) [Publication PMID 19700435](https://pubmed.ncbi.nlm.nih.gov/19700435/)

## Exact downloads

- SOFT metadata: https://ftp.ncbi.nlm.nih.gov/geo/series/GSE14nnn/GSE14580/soft/GSE14580_family.soft.gz
- Series matrix: https://ftp.ncbi.nlm.nih.gov/geo/series/GSE14nnn/GSE14580/matrix/GSE14580_series_matrix.txt.gz
- Raw supplementary archive (not required for this baseline): https://ftp.ncbi.nlm.nih.gov/geo/series/GSE14nnn/GSE14580/suppl/GSE14580_RAW.tar

Downloads were accessed on 2026-09-01. The exact URLs and access date are recorded in sources.csv.

## Inspection findings

The inspection script found:

- 30 total samples: 6 controls and 24 UC samples.
- 24 baseline UC samples: 8 response-labeled responders and 16 response-labeled nonresponders.
- Treatment: infliximab for all UC samples.
- Sample type: colonic mucosal biopsy.
- Measurement: Affymetrix Human Genome U133 Plus 2.0 array series matrix with 54,675 probe rows.
- Timing: all UC samples are before first infliximab treatment; response is assessed after treatment in the source study.
- Duplicate sample IDs: none.
- Duplicate patient IDs: none detected from the GEO titles.
- Conflicting response labels: none detected.
- Matrix/metadata sample-ID mismatch: none.
- Missing matrix values in the downloaded series matrix: none.

## Usability decision

**Usable for:** descriptive responder/nonresponder comparison and a deliberately small, patient-level baseline model benchmark.

**Not sufficient for:** a reliable clinical predictor, causal mechanism claim, treatment recommendation, target nomination, or independent generalization claim. The cohort has only 24 UC patients, is single-study, is restricted to infliximab, and has no independent test cohort in this accession.
