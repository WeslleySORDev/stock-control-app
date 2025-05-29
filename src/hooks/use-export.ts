"use client";
import { useCallback } from "react";
import type { InventoryCount } from "@/types/product";

export function useExport() {
  const exportToPDF = useCallback(async (inventoryCount: InventoryCount) => {
    try {
      // Importação dinâmica para reduzir o bundle size
      const jsPDF = (await import("jspdf")).default;

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Função para adicionar nova página se necessário
      const checkPageBreak = (height: number) => {
        if (yPosition + height > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Relatório de Contagem de Estoque", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text(inventoryCount.name, pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 20;

      // Informações gerais
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Informações Gerais:", margin, yPosition);
      yPosition += 10;

      pdf.setFont("helvetica", "normal");
      const totalQuantity = inventoryCount.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalProducts = inventoryCount.items.length;

      pdf.text(
        `Data da Contagem: ${new Date(inventoryCount.date).toLocaleDateString(
          "pt-BR"
        )}`,
        margin,
        yPosition
      );
      yPosition += 7;
      pdf.text(
        `Total de Produtos Diferentes: ${totalProducts}`,
        margin,
        yPosition
      );
      yPosition += 7;
      pdf.text(`Total de Itens: ${totalQuantity}`, margin, yPosition);
      yPosition += 20;

      // Cabeçalho da tabela
      checkPageBreak(30);
      pdf.setFont("helvetica", "bold");
      pdf.text("Detalhamento dos Itens:", margin, yPosition);
      yPosition += 15;

      // Cabeçalhos das colunas
      const colWidths = [30, 60, 70, 25]; // Larguras das colunas
      const colPositions = [
        margin,
        margin + colWidths[0],
        margin + colWidths[0] + colWidths[1],
        margin + colWidths[0] + colWidths[1] + colWidths[2],
      ];

      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 5, contentWidth, 10, "F");

      pdf.setFont("helvetica", "bold");
      pdf.text("Código", colPositions[0] + 2, yPosition);
      pdf.text("Nome", colPositions[1] + 2, yPosition);
      pdf.text("Descrição", colPositions[2] + 2, yPosition);
      pdf.text("Qtd", colPositions[3] + 2, yPosition);
      yPosition += 10;

      // Linhas da tabela
      pdf.setFont("helvetica", "normal");
      inventoryCount.items.forEach((item, index) => {
        checkPageBreak(15);

        // Fundo alternado
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPosition - 5, contentWidth, 10, "F");
        }

        // Texto das células
        pdf.text(item.product.code, colPositions[0] + 2, yPosition);

        // Nome do produto (com quebra de linha se necessário)
        const nameLines = pdf.splitTextToSize(
          item.product.name,
          colWidths[1] - 4
        );
        pdf.text(nameLines[0], colPositions[1] + 2, yPosition);

        // Descrição (com quebra de linha se necessário)
        const descLines = pdf.splitTextToSize(
          item.product.description,
          colWidths[2] - 4
        );
        pdf.text(descLines[0], colPositions[2] + 2, yPosition);

        // Quantidade
        pdf.text(item.quantity.toString(), colPositions[3] + 2, yPosition);

        yPosition += 10;
      });

      // Total geral
      yPosition += 5;
      pdf.setFillColor(220, 220, 220);
      pdf.rect(margin, yPosition - 5, contentWidth, 10, "F");
      pdf.setFont("helvetica", "bold");
      pdf.text("TOTAL GERAL:", colPositions[2] + 2, yPosition);
      pdf.text(totalQuantity.toString(), colPositions[3] + 2, yPosition);

      // Rodapé
      yPosition += 20;
      checkPageBreak(20);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const footerText = `Relatório gerado em ${new Date().toLocaleDateString(
        "pt-BR"
      )} às ${new Date().toLocaleTimeString("pt-BR")}`;
      pdf.text(footerText, pageWidth / 2, yPosition, { align: "center" });
      pdf.text("Sistema de Controle de Estoque", pageWidth / 2, yPosition + 5, {
        align: "center",
      });

      // Salva o PDF
      const fileName = `contagem-${inventoryCount.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF. Tente novamente.");
    }
  }, []);

  const exportToCSV = useCallback((inventoryCount: InventoryCount) => {
    try {
      const totalQuantity = inventoryCount.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Cabeçalho do CSV
      let csvContent = `Relatório de Contagem de Estoque\n`;
      csvContent += `Nome da Contagem,${inventoryCount.name}\n`;
      csvContent += `Data,${new Date(inventoryCount.date).toLocaleDateString(
        "pt-BR"
      )}\n`;
      csvContent += `Total de Produtos,${inventoryCount.items.length}\n`;
      csvContent += `Total de Itens,${totalQuantity}\n\n`;

      // Cabeçalho da tabela
      csvContent += `Código,Nome do Produto,Descrição,Quantidade\n`;

      // Dados dos itens
      inventoryCount.items.forEach((item) => {
        csvContent += `"${item.product.code}","${item.product.name}","${item.product.description}",${item.quantity}\n`;
      });

      // Linha de total
      csvContent += `,,TOTAL GERAL,${totalQuantity}\n`;

      // Rodapé
      csvContent += `\nRelatório gerado em,${new Date().toLocaleDateString(
        "pt-BR"
      )} ${new Date().toLocaleTimeString("pt-BR")}\n`;

      // Cria e baixa o arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      const fileName = `contagem-${inventoryCount.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`;
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Erro ao exportar CSV. Tente novamente.");
    }
  }, []);

  const printReport = useCallback(() => {
    window.print();
  }, []);

  return {
    exportToPDF,
    exportToCSV,
    printReport,
  };
}
