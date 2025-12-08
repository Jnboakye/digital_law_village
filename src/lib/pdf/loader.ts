import fs from 'fs/promises';

interface PDFParseResult {
  text: string;
  numPages?: number;
  numpages?: number;
  info?: {
    Title?: string;
    title?: string;
    Author?: string;
    author?: string;
    Subject?: string;
    subject?: string;
  };
}

// Dynamic import for pdf-parse to handle ESM/CJS compatibility
async function pdfParse(buffer: Buffer, options?: Record<string, unknown>): Promise<PDFParseResult> {
  // Use require for CommonJS compatibility with pdf-parse v2+
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFParse } = require('pdf-parse');
  
  // Convert Buffer to Uint8Array as required by PDFParse v2+
  const uint8Array = new Uint8Array(buffer);
  
  // Create parser instance
  const parser = new PDFParse({ data: uint8Array, ...options });
  
  // Get text result using the getText() method
  const result = await parser.getText();
  
  return result;
}

export interface PDFContent {
  text: string;
  numPages: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  };
}

/**
 * Load and parse PDF file
 */
export async function loadPDF(filePath: string): Promise<PDFContent> {
  try {
    console.log(`📄 Loading PDF: ${filePath}`);
    
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);

    // pdf-parse v2+ returns result from getText() with text, numPages, and info
    const text = data.text || '';
    const numPages = data.numPages || data.numpages || 0;
    const info = data.info || {};

    console.log(`✓ PDF loaded successfully`);
    console.log(`  Pages: ${numPages}`);
    console.log(`  Text length: ${text.length} characters`);

    return {
      text,
      numPages,
      metadata: {
        title: info?.Title || info?.title,
        author: info?.Author || info?.author,
        subject: info?.Subject || info?.subject,
      },
    };
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error(`Failed to load PDF: ${error}`);
  }
}

/**
 * Extract text from PDF with page numbers
 */
export async function loadPDFWithPages(filePath: string): Promise<Array<{ pageNumber: number; text: string }>> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const uint8Array = new Uint8Array(dataBuffer);
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: uint8Array });
    
    const totalPages = parser.numPages || 0;
    const pages: Array<{ pageNumber: number; text: string }> = [];
    
    // Extract text page by page
    for (let i = 0; i < totalPages; i++) {
      try {
        const pageText = await parser.getPageText(i + 1);
        pages.push({
          pageNumber: i + 1,
          text: pageText || '',
        });
      } catch {
        // If page extraction fails, add empty page
        pages.push({
          pageNumber: i + 1,
          text: '',
        });
      }
    }

    return pages;
  } catch (error) {
    console.error('Error loading PDF with pages:', error);
    throw new Error(`Failed to load PDF with pages: ${error}`);
  }
}

