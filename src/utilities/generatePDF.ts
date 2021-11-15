import PDFDocument from "pdfkit";
import { IExpense } from "../types/expense";
import { IReport } from "../types/report";

export const buildPDF = (
  dataCallBack: any,
  endDataCallback: any,
  report: any
) => {
  let doc = new PDFDocument({ margin: 50 });
  generateHeader(doc);
  generateInvoiceTable(doc, report);
  console.log(report.expenses[0].products[0]);
  doc.on("data", dataCallBack);
  doc.on("end", endDataCallback);
};

const generateHeader = (doc: any) => {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Airis", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
};

function generateTableRow(
  doc: any,
  y: number,
  name: string,
  price: number | string,
  quantity: number | string,
  total: number | string,
  isBold?: boolean
) {
  doc
    .font(isBold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(14)
    .text(name, 50, y)
    .text(`$${price.toString()}`, 140, y, { width: 90, align: "right" })
    .text(`${quantity.toString()}`, 230, y, { width: 90, align: "right" })
    .text(`$${total.toString()}`, 320, y, { width: 90, align: "right" });
}

const generateTitles = (
  doc: any,
  y: number,
  name: string,
  price: number | string,
  total: number | string,
  quantity: number | string,
  isBold?: boolean
) => {
  doc
    .font(isBold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(14)
    .text(name, 50, y)
    .text(`${price.toString()}`, 140, y, { width: 90, align: "right" })
    .text(`${quantity.toString()}`, 230, y, { width: 90, align: "right" })
    .text(`${total.toString()}`, 320, y, { width: 90, align: "right" });
};

function generateInvoiceTable(doc: any, report: IReport) {
  let i,
    invoiceTableTop = 150;
  let itemsPos = 300;
  generateExpenseRow(doc, report.expenses[0]);
  // generateTableRow(
  //   doc,
  //   invoiceTableTop,
  //   "Category",
  // );
  for (i = 0; i < report.expenses.length; i++) {
    const item = report.expenses[i];
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(`Merchant: ${item.merchantName}`);
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(`Category: ${item.category.name}`);
    doc.moveDown();
    doc.fontSize(15).text(`Items:`);
    doc.moveDown();
    doc.moveDown();
    generateTitles(doc, itemsPos, "Product name", "Price", "Total", "Quantity", true);
    generateHr(doc, itemsPos + 25);

    for (let j = 0; j < item.products.length; j++) {
      const position = itemsPos + (j + 1) * 40;
      const product = item.products[j];
      generateTableRow(
        doc,
        position,
        product.name,
        product.price,
        product.quantity,
        product.price * product.quantity
      );
      if (j < item.products.length - 1) {
        generateHr(doc, position + 25);
      }
    }
    // generateTableRow(
    //   doc,
    //   position,
    //   item.category
    // );
    // generateHr(doc, position + 20);
  }
  doc.end();
}

const generateExpenseRow = (doc: any, expense: any) => {
  doc.fillColor("#444444").fontSize(20).text(`Expense Report`, 50, 160);
  doc.moveDown();
  generateHr(doc, 190);
};

const generateHr = (doc: any, y: number) => {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
};
