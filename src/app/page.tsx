"use client";
import Link from "next/link";
import { Plus, Package, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventoryCount } from "@/contexts/StockContext";

export default function HomePage() {
  const { inventoryCounts } = useInventoryCount();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Controle de Estoque
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas contagens de inventário
            </p>
          </div>
          <Link href="/nova-contagem">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nova Contagem
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inventoryCounts.map((count) => (
            <Link href={`/contagem/${count.id}`} key={count.id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Package className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary">{count.total} itens</Badge>
                  </div>
                  <CardTitle className="text-xl">{count.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(count.date).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total de produtos
                    </span>
                    <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">{count.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {inventoryCounts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma contagem encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando sua primeira contagem de estoque
            </p>
            <Link href="/nova-contagem">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira contagem
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
