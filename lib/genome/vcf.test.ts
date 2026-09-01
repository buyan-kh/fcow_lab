import { describe, expect, it } from 'vitest';
import { parseSyntheticVcf, validateSyntheticVcf } from './vcf';
import { SYNTHETIC_VCF } from './fixtures';

describe('synthetic VCF parsing', () => {
  it('accepts the marked demo VCF and returns typed variants', () => {
    const result = parseSyntheticVcf(SYNTHETIC_VCF, 'demo.vcf');
    expect(result.upload.isSynthetic).toBe(true);
    expect(result.upload.variantCount).toBe(2);
    expect(result.variants[0]).toMatchObject({ chromosome: 'chr1', position: 123456, genotype: '0/1', quality: 98, filter: 'PASS', gene: 'GENE-X1' });
  });

  it('rejects an unmarked or malformed VCF before returning genome data', () => {
    expect(() => validateSyntheticVcf(SYNTHETIC_VCF.replace('##frontier_bio_synthetic=true\n', ''))).toThrow(/synthetic marker/i);
    expect(() => parseSyntheticVcf(`${SYNTHETIC_VCF}\nchr1\tbad`, 'bad.vcf')).toThrow(/line/i);
  });

  it('rejects clinical-looking uploads unless explicitly marked synthetic', () => {
    expect(() => parseSyntheticVcf('##fileformat=VCFv4.3\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\nchr1\t1\t.\tA\tG\t50\tPASS\t.', 'clinical.vcf')).toThrow(/local synthetic/i);
  });
});
