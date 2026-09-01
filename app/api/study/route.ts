import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { classifyCommandResult, readStudySnapshot } from '@/lib/study-control';
import { ANALYSIS_COMMAND } from '@/lib/study-shared';
import { bundledStudySnapshot } from '@/lib/study-bundled';
import summary from '@/research/uc_failure_study/results/descriptive_summary.json';
import metrics from '@/research/uc_failure_study/results/model_metrics.json';
import replicationSummary from '@/research/uc_failure_study/results/replication_gse206285/descriptive_summary.json';
import replicationMetrics from '@/research/uc_failure_study/results/replication_gse206285/model_metrics.json';
import reportRaw from '@/research/uc_failure_study/report.md?raw';
import sourcesRaw from '@/research/uc_failure_study/sources.csv?raw';
import probesRaw from '@/research/uc_failure_study/results/probe_effects.csv?raw';
import reportData from '@/research/uc_failure_study/results/report_data.json';

const root = process.cwd();
export const runtime = 'nodejs';
const studyDir = join(root, 'research', 'uc_failure_study');
const artifactPaths: Record<string, { path: string; contentType: string }> = {
  report: { path: join(studyDir, 'report.md'), contentType: 'text/markdown; charset=utf-8' },
  sources: { path: join(studyDir, 'sources.csv'), contentType: 'text/csv; charset=utf-8' },
  model_metrics: { path: join(studyDir, 'results', 'model_metrics.json'), contentType: 'application/json; charset=utf-8' },
  summary: { path: join(studyDir, 'results', 'descriptive_summary.json'), contentType: 'application/json; charset=utf-8' },
  probes: { path: join(studyDir, 'results', 'probe_effects.csv'), contentType: 'text/csv; charset=utf-8' },
  report_data: { path: join(studyDir, 'results', 'report_data.json'), contentType: 'application/json; charset=utf-8' },
};

const bundledArtifacts: Record<string, { body: string; contentType: string }> = {
  report: { body: reportRaw, contentType: 'text/markdown; charset=utf-8' },
  sources: { body: sourcesRaw, contentType: 'text/csv; charset=utf-8' },
  model_metrics: { body: JSON.stringify(metrics, null, 2), contentType: 'application/json; charset=utf-8' },
  summary: { body: JSON.stringify(summary, null, 2), contentType: 'application/json; charset=utf-8' },
  probes: { body: probesRaw, contentType: 'text/csv; charset=utf-8' },
  report_data: { body: JSON.stringify(reportData, null, 2), contentType: 'application/json; charset=utf-8' },
  replication_summary: { body: JSON.stringify(replicationSummary, null, 2), contentType: 'application/json; charset=utf-8' },
  replication_metrics: { body: JSON.stringify(replicationMetrics, null, 2), contentType: 'application/json; charset=utf-8' },
};

function runStudyCommand(): Promise<ReturnType<typeof classifyCommandResult>> {
  return new Promise((resolve) => {
    const child = spawn('sh', ['-lc', `set -o pipefail; ${ANALYSIS_COMMAND}`], { cwd: root, env: process.env });
    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => child.kill('SIGTERM'), 180_000);
    child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on('error', (error) => {
      clearTimeout(timeout);
      resolve(classifyCommandResult({ code: 1, stdout, stderr: `${stderr}${error.message}` }));
    });
    child.on('close', (code) => {
      clearTimeout(timeout);
      resolve(classifyCommandResult({ code, stdout, stderr }));
    });
  });
}

export async function GET(request: NextRequest) {
  const artifact = request.nextUrl.searchParams.get('artifact');
  if (artifact) {
    const selected = artifactPaths[artifact];
    const bundled = bundledArtifacts[artifact];
    if (!selected && !bundled) return NextResponse.json({ error: 'Unknown artifact.' }, { status: 404 });
    if (bundled) {
      return new NextResponse(bundled.body, { headers: { 'content-type': bundled.contentType, 'content-disposition': `inline; filename="${artifact}"` } });
    }
    try {
      return new NextResponse(readFileSync(selected.path), { headers: { 'content-type': selected.contentType, 'content-disposition': `inline; filename="${artifact}"` } });
    } catch {
      return NextResponse.json({ status: 'not-run', message: 'Artifact is not available.' }, { status: 404 });
    }
  }
  const snapshot = readStudySnapshot(root);
  return NextResponse.json(snapshot.status === 'not-run' ? bundledStudySnapshot : snapshot);
}

export async function POST() {
  if (root === '/bundle') {
    const command = ANALYSIS_COMMAND;
    const output = 'Local command execution is unavailable in the Vinext preview runtime (filesystem root is /bundle). Run the exact command in the project shell.';
    const result = classifyCommandResult({ code: 1, stdout: '', stderr: output });
    return NextResponse.json({ ...result, command, files: bundledStudySnapshot.resultFiles }, { status: 500 });
  }
  const result = await runStudyCommand();
  const statusCode = result.status === 'completed' ? 200 : 500;
  return NextResponse.json({ ...result, command: ANALYSIS_COMMAND, files: readStudySnapshot(root).resultFiles }, { status: statusCode });
}
