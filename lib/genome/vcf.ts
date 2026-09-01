import type { GenomeUpload, Variant } from './domain';

const SYNTHETIC_MARKER = '##frontier_bio_synthetic=true';

export function validateSyntheticVcf(text: string): void {
  if (!text.includes(SYNTHETIC_MARKER)) throw new Error('Upload rejected: local synthetic marker is required.');
  const header = text.split(/\r?\n/).find((line) => line.startsWith('#CHROM'));
  if (!header) throw new Error('VCF is malformed: #CHROM header line is required.');
  const columns = header.split('\t');
  if (columns.length < 8) throw new Error('VCF is malformed: expected at least 8 tab-separated columns.');
}

function parseInfo(info: string): Record<string, string> {
  return Object.fromEntries(info.split(';').filter(Boolean).map((entry) => {
    const [key, ...rest] = entry.split('=');
    return [key, rest.join('=') || ''];
  }));
}

export function parseSyntheticVcf(text: string, filename = 'synthetic.vcf'): { upload: GenomeUpload; variants: Variant[] } {
  validateSyntheticVcf(text);
  const rows = text.split(/\r?\n/).filter((line) => line && !line.startsWith('#'));
  const variants = rows.map((row, index) => {
    const columns = row.split('\t');
    if (columns.length < 8) throw new Error(`VCF malformed at line ${index + 1}: expected tab-separated variant columns.`);
    const [chromosome, positionText, id, referenceAllele, alternateAllele, qualityText, filter, infoText, , sample] = columns;
    const position = Number(positionText);
    const quality = Number(qualityText);
    if (!/^chr[0-9XYM]+$/i.test(chromosome) || !Number.isInteger(position) || position < 1) throw new Error(`VCF malformed at line ${index + 1}: chromosome or position is invalid.`);
    if (!/^[ACGTN]+$/i.test(referenceAllele) || !/^[ACGTN]+$/i.test(alternateAllele)) throw new Error(`VCF malformed at line ${index + 1}: allele is invalid.`);
    if (!Number.isFinite(quality) || !filter) throw new Error(`VCF malformed at line ${index + 1}: quality or filter is invalid.`);
    const info = parseInfo(infoText);
    const genotype = sample?.split(':')[0] ?? '';
    if (!/^\d[\/|]\d$/.test(genotype)) throw new Error(`VCF malformed at line ${index + 1}: genotype is invalid.`);
    return {
      id: id && id !== '.' ? id : `variant-${index + 1}`, chromosome, position, referenceAllele: referenceAllele.toUpperCase(), alternateAllele: alternateAllele.toUpperCase(), genotype, quality, filter,
      gene: info.GENE || 'UNANNOTATED', transcript: info.TRANSCRIPT || 'UNANNOTATED', variantType: info.TYPE === 'indel' || referenceAllele.length !== alternateAllele.length ? 'indel' : 'SNV', clinicalSignificance: 'Not assessed', evidenceState: filter.toUpperCase() === 'PASS' ? 'supportive' : 'uncertain', sourceIds: [],
    } satisfies Variant;
  });
  return { upload: { id: `upload-${Date.now()}`, filename, isSynthetic: true, sourceLabel: 'Local synthetic VCF', variantCount: variants.length }, variants };
}
