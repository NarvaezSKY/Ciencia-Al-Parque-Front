import { Card } from "@heroui/react";

interface Props {
  titulo: string;
  valor: number | string;
  descripcion?: string;
}

export default function StatCard({ titulo, valor, descripcion }: Props) {
  return (
    <Card className="border border-slate-200">
      <Card.Content className="p-4">
        <p className="text-sm text-slate-500">{titulo}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{valor}</p>
        {descripcion && (
          <p className="mt-1 text-xs text-slate-400">{descripcion}</p>
        )}
      </Card.Content>
    </Card>
  );
}
