# Research question

## Primary question

Can a reproducible public dataset distinguish ulcerative colitis treatment responders from nonresponders on new patients or samples, without leaking study or patient identity across evaluation splits?

## Scientific motivation

AX014 is investigating why some people with ulcerative colitis fail existing treatments. The first study is deliberately narrow: establish whether public data contains enough treatment, response, disease-definition, measurement, and timing information to support a reproducible signal at all.

This study does not assume that treatment failure has one cause. It will describe observed differences and test simple predictive baselines before proposing any biological explanation. A correlation will not be called a mechanism, a model result will not be called a drug target, and no result will be presented as a treatment recommendation.

## Predefined groups

- **Treatment responder:** a source-defined response or remission label at the source-defined assessment time.
- **Treatment nonresponder:** a source-defined nonresponse, failed induction, or no-remission label at the same assessment time.
- **Primary nonresponse:** failure to meet the source-defined induction response criterion without a prior response to that treatment in the same study.
- **Loss of response:** a source-defined loss of a previously achieved response during follow-up or maintenance.
- **Unknown or unusable:** missing, conflicting, ambiguous, or non-comparable treatment/response information.

Groups will remain separate unless the selected source explicitly supports combining them. Unknown or unusable records will be reported and excluded from supervised analyses.

## Scope and safety

- Public research data only.
- No personal medical data, confidential Genentech or UCSF data, or restricted-access records.
- No patient-level re-identification, clinical advice, diagnosis, treatment recommendation, dosage recommendation, or drug recommendation.
- No invented patients, measurements, labels, results, mechanisms, or targets.

## Success criterion

The study succeeds only if it produces a reproducible answer with exact data, labels, split method, baseline, test result, uncertainty, and an independent repetition. A null or unusable result is a valid result and must be reported as such.
