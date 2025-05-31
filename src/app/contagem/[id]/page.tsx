"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Calendar,
  Hash,
  FileText,
  Printer,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExport } from "@/hooks/use-export";
import { InventoryCount } from "@/types/inventory";

interface ContagemPageProps {
  id: string;
}

interface ContagemComponentProps {
  params: Promise<ContagemPageProps>;
}

const TEST_INVENTORY_COUNT: InventoryCount = {
  id: "1",
  owner: "Weslley",
  name: "Contagem Rhai",
  created_at: "05-30-2025",
  products: [
    {
      code: "M3500",
      name: "Massa Poliester",
      quantity: 5
    },
    {
      code: "8000",
      name: "Verniz 8000 kit",
      quantity: 12
    },
    {
      code: "8937",
      name: "Verniz 8937",
      quantity: 35
    }
  ]
}

const TEST_INVENTORY_COUNT_LIST: InventoryCount[] = [TEST_INVENTORY_COUNT]

export default function ContagemPage({ params }: ContagemComponentProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [currentStockCount] = useState<InventoryCount | null>(
    TEST_INVENTORY_COUNT_LIST.find((count) => count.id === id) || null
  );
  const [isExporting, setIsExporting] = useState(false);
  const { exportToPDF, exportToCSV, printReport } = useExport();

  if (!currentStockCount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Contagem não encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            A contagem solicitada não existe ou foi removida.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalQuantity = currentStockCount.products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalProducts = currentStockCount.products.length;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(currentStockCount);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(currentStockCount);
  };

  const handlePrint = () => {
    printReport();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 print:bg-white print-content">
        <div className="container mx-auto px-4 py-8 print:px-0 print:py-0">
          <div className="flex items-center gap-4 mb-8 print:hidden">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentStockCount.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Visualização da contagem de inventário
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 print:grid-cols-1">
            <div className="lg:col-span-2 print:col-span-1">
              <Card className="print:shadow-none print:border-none">
                <CardHeader className="print:pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Itens da Contagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentStockCount.products.map((item, index) => (
                      <div key={item.code}>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-300">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Package className="h-5 w-5 text-gray-400 print:hidden" />
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="mt-1 print:border-gray-400"
                                >
                                  Código: {item.code}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 print:text-black">
                              {item.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              unidades
                            </div>
                          </div>
                        </div>
                        {index < currentStockCount.products.length - 1 && (
                          <Separator className="my-4 print:hidden" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="print:hidden">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resumo da Contagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data da contagem:
                        </span>
                      </div>
                      <div className="text-lg font-semibold">
                        {new Date(currentStockCount.created_at).toLocaleDateString(
                          "pt-BR",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Produtos diferentes:
                        </span>
                        <div className="flex items-center gap-1">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-lg">
                            {totalProducts}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de itens:</span>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-lg">
                            {totalQuantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {totalQuantity}
                        </div>
                        <div className="text-sm text-blue-800">
                          Total Geral de Itens
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir Relatório
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="w-full"
                            variant="outline"
                            disabled={isExporting}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {isExporting
                              ? "Exportando..."
                              : "Exportar Relatório"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem onClick={handleExportPDF}>
                            <FileText className="h-4 w-4 mr-2" />
                            Exportar como PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportCSV}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Exportar como CSV
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }

            .print-content,
            .print-content * {
              visibility: visible;
            }

            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }

            .print:bg-white {
              background: white !important;
            }

            .print\\:shadow-none {
              box-shadow: none !important;
            }

            .print\\:border-none {
              border: none !important;
            }

            .print\\:hidden {
              display: none !important;
            }

            .print\\:block {
              display: block !important;
            }

            .print\\:text-black {
              color: black !important;
            }

            .print\\:border-gray-400 {
              border-color: #9ca3af !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
