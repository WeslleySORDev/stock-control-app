"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AddQuantityModal } from "@/components/add-quantity-modal";
import { AddProductModal } from "@/components/add-product-modal";
import type { Product, InventoryItem } from "@/types/product";
import { useInventoryCount } from "@/contexts/InventoryCountContext";

// Produtos simulados - em produção viriam de um banco de dados
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Notebook Dell Inspiron",
    description: "Notebook Dell Inspiron 15 3000",
    code: "NB001",
  },
  {
    id: "2",
    name: "Mouse Logitech",
    description: "Mouse óptico sem fio Logitech M170",
    code: "MS002",
  },
  {
    id: "3",
    name: "Teclado Mecânico",
    description: "Teclado mecânico RGB Redragon",
    code: "KB003",
  },
];

export default function NovaContagemPage() {
  const { addInventoryCount } = useInventoryCount();
  const [countName, setCountName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddQuantityModalOpen, setIsAddQuantityModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
    );
  };

  const handleAddQuantity = (quantity: number) => {
    if (selectedItem) {
      handleQuantityChange(
        selectedItem.product.id,
        selectedItem.quantity + quantity
      );
    }
    setIsAddQuantityModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddProduct = (product: Product) => {
    setInventoryItems((prev) => [...prev, { product, quantity: 0 }]);
    setIsAddProductModalOpen(false);
  };

  const totalItems = inventoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Contagem</h1>
            <p className="text-gray-600 mt-2">
              Crie uma nova contagem de inventário
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações da Contagem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="count-name">Nome da Contagem</Label>
                    <Input
                      id="count-name"
                      placeholder="Ex: Contagem Janeiro 2024"
                      value={countName}
                      onChange={(e) => setCountName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-name">
                      Nome da Pessoa que está contando
                    </Label>
                    <Input
                      id="owner-name"
                      placeholder="Ex: João Silva"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Produtos no Estoque</CardTitle>
                <Button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-semibold">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.product.description}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              Código: {item.product.code}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product.id,
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            className="w-20 text-center"
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsAddQuantityModalOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo da Contagem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de produtos:</span>
                    <span className="font-semibold">
                      {inventoryItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de itens:</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-semibold">
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <Button
                      className="w-full"
                      disabled={!countName.trim() || !ownerName.trim()}
                    >
                      Salvar Contagem
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddQuantityModal
        isOpen={isAddQuantityModalOpen}
        onClose={() => {
          setIsAddQuantityModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleAddQuantity}
        productName={selectedItem?.product.name || ""}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onConfirm={handleAddProduct}
      />
    </div>
  );
}
