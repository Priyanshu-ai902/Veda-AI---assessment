import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import fs from 'fs';

export const generatePDF = async (paperData: any, outputPath: string): Promise<string> => {
  const assignmentId = paperData.assignmentId || paperData._id;
  console.log(`[PDF Service] Capturing LIVE UI for Assignment: ${assignmentId}`);
  
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const realPageUrl = `${clientUrl}/assignments/output?id=${assignmentId}`;
  
  let browser;
  
  if (process.env.VERCEL) {
    // Vercel serverless environment
    const chromium = require('@sparticuz/chromium');
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Local environment
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }

  try {
    const page = await browser.newPage();
    
    console.log(`[PDF Service] Puppeteer visiting LIVE URL: ${realPageUrl}`);

    // Standard high-res desktop viewport
    await page.setViewport({ width: 1440, height: 2000 });

    // visit the REAL assignment page
    await page.goto(realPageUrl, { 
      waitUntil: 'networkidle0',
      timeout: 45000 
    });

    // Emulate print media type
    await page.emulateMediaType('print');

    // Wait for the assignment preview component to render in the real page context
    await page.waitForSelector('#assignment-print-root', { timeout: 15000 });

    // Optional: Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF from the exact live DOM
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      }
    });

    console.log(`[PDF Service] Successfully captured live UI to PDF at: ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error('[PDF Service] LIVE UI Capture Failed:', (error as Error).message);
    throw error;
  } finally {
    await browser.close();
  }
};
