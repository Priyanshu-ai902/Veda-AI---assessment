import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

export const generatePDF = async (paperData: any): Promise<Buffer> => {
  const assignmentId = paperData.assignmentId || paperData._id;
  console.log(`[PDF Service] Capturing LIVE UI for Assignment: ${assignmentId}`);
  
  // Use VERCEL_URL if available, otherwise localhost
  const clientUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
  const realPageUrl = `${clientUrl}/assignments/output?id=${assignmentId}`;
  
  let browser;
  const isVercel = process.env.VERCEL || process.env.VERCEL_URL;
  
  if (isVercel) {
    console.log('[PDF Service] Launching serverless Chromium...');
    // Vercel serverless environment
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless as any,
    });
  } else {
    console.log('[PDF Service] Launching local Puppeteer...');
    // Local environment
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  try {
    const page = await browser.newPage();
    console.log(`[PDF Service] Visiting LIVE URL: ${realPageUrl}`);
    await page.setViewport({ width: 1440, height: 2000 });

    await page.goto(realPageUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    await page.emulateMediaType('print');

    // Generate PDF as Buffer
    const pdfBuffer = await page.pdf({
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

    console.log(`[PDF Service] Successfully captured PDF buffer.`);
    return Buffer.from(pdfBuffer);

  } catch (error) {
    console.error('[PDF Service] Capture Failed:', (error as Error).message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};
