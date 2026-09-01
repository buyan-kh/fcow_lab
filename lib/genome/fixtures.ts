import type { DiseaseAssociation, EvidenceItem, Gene, Pathway, Variant, ValidationExperiment } from './domain';

export const SYNTHETIC_VCF = `##fileformat=VCFv4.3
##frontier_bio_synthetic=true
##source=Frontier Bio synthetic demo fixture
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tDEMO
chr1\t123456\tvar-x1\tG\tA\t98\tPASS\tGENE=GENE-X1;TRANSCRIPT=TX-X1;TYPE=SNV\tGT:DP\t0/1:42
chr6\t654321\tvar-y2\tC\tT\t72\tq10\tGENE=GENE-Y2;TRANSCRIPT=TX-Y2;TYPE=SNV\tGT:DP\t1/1:31`;

export const demoVariants: Variant[] = [
  {
    id: 'var-x1', chromosome: 'chr1', position: 123456, referenceAllele: 'G', alternateAllele: 'A', genotype: '0/1', quality: 98,
    filter: 'PASS', gene: 'GENE-X1', transcript: 'TX-X1', variantType: 'SNV', clinicalSignificance: 'Not assessed', evidenceState: 'supportive', sourceIds: ['ev-support-1', 'ev-conflict-1'],
  },
  {
    id: 'var-y2', chromosome: 'chr6', position: 654321, referenceAllele: 'C', alternateAllele: 'T', genotype: '1/1', quality: 72,
    filter: 'q10', gene: 'GENE-Y2', transcript: 'TX-Y2', variantType: 'SNV', clinicalSignificance: 'Not assessed', evidenceState: 'uncertain', sourceIds: ['ev-missing-1'],
  },
];

export const demoGenes: Gene[] = [
  { id: 'gene-x1', symbol: 'GENE-X1', name: 'Synthetic epithelial response regulator', summary: 'Fixture gene used to model a context-dependent inflammatory signal.' },
  { id: 'gene-y2', symbol: 'GENE-Y2', name: 'Synthetic barrier response modulator', summary: 'Fixture gene used to model an unresolved tissue-specific association.' },
];

export const demoPathways: Pathway[] = [
  { id: 'pathway-p1', name: 'P1 epithelial cytokine signaling (fixture)', description: 'Synthetic pathway connecting the variant context to a research mechanism.', geneIds: ['gene-x1', 'gene-y2'] },
];

export const demoDiseases: DiseaseAssociation[] = [
  { id: 'disease-d1', name: 'Inflammatory bowel disease (fixture)', context: 'Disease-level research context only; not an individual diagnosis.', geneIds: ['gene-x1'] },
];

export const demoEvidence: EvidenceItem[] = [
  {
    id: 'ev-support-1', claim: 'The synthetic GENE-X1 context is associated with altered epithelial cytokine signaling in the fixture.', sourceTitle: 'Frontier Bio public-evidence fixture A', sourceUrl: 'https://example.org/frontier-bio/fixture-a', sourceIdentifier: 'FB-FIX-A-001', publicationDate: '2025-05-14', retrievedDate: '2026-09-01', evidenceType: 'fixture literature', evidenceState: 'supportive', gene: 'GENE-X1', variant: 'var-x1', disease: 'Inflammatory bowel disease (fixture)', excerpt: 'Synthetic evidence fixture: altered signaling observed in a controlled model.', limitations: 'Synthetic observation; no clinical or patient-level inference.'
  },
  {
    id: 'ev-conflict-1', claim: 'A separate synthetic fixture did not reproduce the direction of the GENE-X1 signaling change.', sourceTitle: 'Frontier Bio public-evidence fixture B', sourceUrl: 'https://example.org/frontier-bio/fixture-b', sourceIdentifier: 'FB-FIX-B-002', publicationDate: '2024-11-02', retrievedDate: '2026-09-01', evidenceType: 'fixture association', evidenceState: 'conflicting', gene: 'GENE-X1', variant: 'var-x1', disease: 'Inflammatory bowel disease (fixture)', excerpt: 'Synthetic evidence fixture: effect direction was not reproduced in a second model.', limitations: 'Model mismatch and small synthetic sample; requires controlled replication.'
  },
  {
    id: 'ev-missing-1', claim: 'No fixture establishes whether GENE-Y2 changes function in the relevant tissue.', sourceTitle: 'Evidence gap registry (fixture)', sourceUrl: 'https://example.org/frontier-bio/gaps', sourceIdentifier: 'FB-GAP-003', publicationDate: '2026-01-01', retrievedDate: '2026-09-01', evidenceType: 'fixture gap', evidenceState: 'missing', gene: 'GENE-Y2', variant: 'var-y2', disease: 'Inflammatory bowel disease (fixture)', excerpt: 'Synthetic gap: no tissue-relevant functional observation is available.', limitations: 'Absence of fixture evidence is not evidence of absence.'
  },
];

export const demoExperiment: ValidationExperiment = {
  id: 'exp-fixture-1', title: 'Controlled GENE-X1 perturbation and rescue study', objective: 'Test whether changing GENE-X1 activity changes the fixture pathway signal in a controlled epithelial model.', assayType: 'Perturbation, rescue, and pathway-marker assay', falsifier: 'No reproducible rescue across three synthetic donor contexts with pathway-consistent markers.', controls: ['Non-targeting perturbation', 'Reference pathway control', 'Three synthetic donor contexts'], expectedDuration: '3–4 weeks', status: 'needs review',
};

export const demoUpload = { id: 'upload-demo', filename: 'frontier-bio-synthetic-demo.vcf', isSynthetic: true as const, sourceLabel: 'Built-in synthetic demo' as const, variantCount: demoVariants.length };
