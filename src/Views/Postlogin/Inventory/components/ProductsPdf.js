// Generate table with header and watermark on each page
autoTable(doc, {
  head: [["S.No", "Product Name", "Unit", "Price"]],
  body: tableData,
  startY: 25,
  startX: 0,
  margin: { left: 5, right: 5, top: 25, bottom: 0 },
  padding: 0,
  tableWidth: "auto",
  theme: "striped",
  headStyles: {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    fontStyle: "bold",
    fontSize: 12
  },
  styles: {
    fontSize: 12,
    cellPadding: 2,
    textColor: [0, 0, 0]
  },
  columnStyles: {
    0: { cellWidth: 20 }, // S.No
    1: { cellWidth: 100 }, // Product Name
    2: { cellWidth: 40 }, // Unit
    3: { cellWidth: 40 }  // Price
  },
  didDrawPage: function(data) {
    // Add header and watermark to each page
    addHeader();
    addWatermark();
  },
  didDrawCell: function(data) {
    // Ensure watermark stays behind content
    if (data.section === 'head' && data.row.index === 0) {
      addWatermark();
    }
  }
});

// Add footer only on the last page
const pageCount = doc.internal.getNumberOfPages();
doc.setPage(pageCount);
doc.setFontSize(12);
doc.setFont(undefined, "normal");
doc.text("<------------------------------------------------------------ ", doc.internal.pageSize.width / 2 - 15, doc.internal.pageSize.height - 20, { align: "right" });
doc.setFont(undefined, "bold");
doc.text("Thank You", doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: "center" });
doc.setFont(undefined, "normal"); 
doc.text(" ----------------------------------------------------------->", doc.internal.pageSize.width / 2 + 15, doc.internal.pageSize.height - 20, { align: "left" });
doc.text("www.promodeagro.com", 5, doc.internal.pageSize.height - 10, { align: "left" });
doc.text("support@promodeagro.com", 205, doc.internal.pageSize.height - 10, { align: "right" });

doc.save("products.pdf"); 