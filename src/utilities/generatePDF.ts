import puppeteer from "puppeteer";

export const generatePDF = async (html: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const pdfBuffer = await page.pdf();

  await page.close();
  await browser.close();
  return pdfBuffer;
}