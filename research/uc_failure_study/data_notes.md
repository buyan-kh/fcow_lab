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

## Independent replication: GSE206285

GEO GSE206285 is a public, independent cohort from the UNIFI ustekinumab trial. The series contains 550 UC baseline colon biopsies and 18 healthy controls. UC participants are assigned to placebo (186) or ustekinumab (364), with dose arm recorded. The selected endpoint is the source-provided `mucosal healing at week 8` Y/N label; six ustekinumab baseline samples have missing labels and are excluded. The locked active-treatment cohort therefore contains 358 samples: 56 responders and 302 nonresponders. All samples are collected at `WEEK I-0`; the series matrix has 568 samples, 54,715 probes, zero missing expression values, no duplicate sample/patient IDs, and no metadata/matrix ID mismatch. The endpoint is not identical to GSE14580's combined endoscopic/histologic healing definition, so the datasets are analyzed separately and never concatenated.

Exact downloads, the eligibility screen, and analysis outputs are recorded in `sources.csv`, `results/replication_gse206285_inspection.json`, and `replication_gse206285_report.md`.
