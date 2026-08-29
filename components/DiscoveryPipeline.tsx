import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

type PipelineStage = {
  label: string;
  caption: string;
  status: 'complete' | 'active' | 'next';
};

export default function DiscoveryPipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <Card className="workspace-card">
      <CardHeader className="workspace-card-header">
        <div>
          <p className="workspace-kicker">Asset creation path</p>
          <CardTitle>Discovery pipeline</CardTitle>
        </div>
        <Badge variant="outline">Biology leads</Badge>
      </CardHeader>
      <CardContent>
        <div className="pipeline" aria-label="Drug discovery pipeline">
          {stages.map((stage, index) => (
            <div className="pipeline-stage" key={stage.label}>
              <div className={`pipeline-marker pipeline-${stage.status}`} aria-hidden="true">
                {stage.status === 'complete' ? '✓' : index + 1}
              </div>
              <div className="pipeline-copy">
                <div className="pipeline-title-row">
                  <strong>{stage.label}</strong>
                  <Badge variant={stage.status === 'active' ? 'default' : 'secondary'}>
                    {stage.status === 'active' ? 'Current' : stage.status === 'complete' ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
                <p>{stage.caption}</p>
              </div>
              {index < stages.length - 1 ? <Separator className="pipeline-connector" /> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
