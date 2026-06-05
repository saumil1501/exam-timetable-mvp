import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface Props {
  title: string;
  value: number;
  color: string;
}

export default function StatCard({
  title,
  value,
  color,
}: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p
          className={`text-3xl font-bold ${color}`}
        >
          {value}
        </p>

        <p className="text-sm text-muted-foreground">
          {title}
        </p>
      </CardContent>
    </Card>
  );
}