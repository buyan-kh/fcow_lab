import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export default function DecisionRecord({
  question,
  recommendation,
  rationale,
  criteria,
  owner,
  recorded,
}: {
  question: string;
  recommendation: string;
  rationale: string;
  criteria: string;
  owner: string;
  recorded: string;
}) {
  return (
    <Card className="workspace-card decision-record">
      <CardHeader className="workspace-card-header">
        <div>
          <p className="workspace-kicker">Saved program judgment</p>
          <CardTitle>Decision record</CardTitle>
        </div>
        <Badge variant="outline">Draft for review</Badge>
      </CardHeader>
      <CardContent className="decision-record-content">
        <div>
          <p className="record-label">Decision question</p>
          <p className="record-question">{question}</p>
        </div>
        <Separator />
        <div>
          <p className="record-label">Recommendation</p>
          <p className="record-recommendation">{recommendation}</p>
          <p className="record-body">{rationale}</p>
        </div>
        <div className="record-grid">
          <div>
            <p className="record-label">Advance criterion</p>
            <p className="record-body">{criteria}</p>
          </div>
          <div>
            <p className="record-label">Owner</p>
            <p className="record-body">{owner}</p>
            <p className="record-meta">Recorded {recorded}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
