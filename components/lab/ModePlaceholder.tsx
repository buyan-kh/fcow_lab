import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModePlaceholder({ title, description }: { title: string; description: string }) {
  return <section className="lab-placeholder"><div className="lab-placeholder-copy"><Badge variant="outline">Coming next.</Badge><h1>{title}</h1><p>{description}</p></div><Card className="lab-card"><CardHeader><CardTitle>Synthetic demonstration only.</CardTitle><CardDescription>{title === 'Explore' ? 'This future layer will connect questions to source-backed evidence and uncertainty.' : 'This future layer will organize synthetic cases for clinician discussion.'}</CardDescription></CardHeader><CardContent><strong>No real medical records are processed.</strong><p>Personal Wellness is the only functional mode in this phase.</p></CardContent></Card></section>;
}
