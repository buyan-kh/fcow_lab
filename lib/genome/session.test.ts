import { describe, expect, it, vi } from 'vitest';
import { createGenomeSession, deleteGenomeSession } from './session';
import { demoUpload, demoVariants } from './fixtures';

describe('genome session privacy', () => {
  it('keeps a session in memory and deletes all genome-derived state', () => {
    const session = createGenomeSession(demoUpload, demoVariants);
    expect(session.upload.variantCount).toBe(2);
    expect(deleteGenomeSession(session)).toBeNull();
  });

  it('does not log raw genome data while creating or deleting a session', () => {
    const spy = vi.spyOn(console, 'log');
    const session = createGenomeSession(demoUpload, demoVariants);
    deleteGenomeSession(session);
    expect(spy).not.toHaveBeenCalled();
    expect(spy.mock.calls.flat().join(' ')).not.toContain('GENE-X1');
    spy.mockRestore();
  });
});
