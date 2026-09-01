import type { GenomeUpload, Variant } from './domain';

export type GenomeSession = { upload: GenomeUpload; variants: Variant[] };

export function createGenomeSession(upload: GenomeUpload, variants: Variant[]): GenomeSession {
  return { upload: { ...upload, variantCount: variants.length }, variants: variants.map((variant) => ({ ...variant, sourceIds: [...variant.sourceIds] })) };
}

export function deleteGenomeSession(session: GenomeSession | null): null {
  void session;
  return null;
}
