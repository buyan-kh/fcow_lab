# Genome Data Contract

## Local input

The parser accepts VCF-like text only when it contains `##frontier_bio_synthetic=true`, a `#CHROM` header, and valid tab-separated variant rows. Required fields are chromosome, position, reference allele, alternate allele, quality, filter, and genotype. INFO may provide `GENE`, `TRANSCRIPT`, and `TYPE` annotations.

## Internal objects

`GenomeUpload` identifies the synthetic source and variant count. `Variant` stores normalized genomic fields and evidence IDs. `EvidenceItem`, `Gene`, `Pathway`, `DiseaseAssociation`, `MechanismHypothesis`, `TherapeuticHypothesis`, and `ValidationExperiment` store research context and provenance. Public adapters must return these same types and must not mix user genome data with public research data.

## Retention

Only the active in-memory session exists. The original input string is not retained after parsing, is not included in reports, and is not sent outside the browser.
