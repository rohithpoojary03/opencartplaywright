const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Root path
const rootDir = path.join(__dirname, '..');

// Folders
const folders = {
  pages: path.join(rootDir, 'pages'),
  tests: path.join(rootDir, 'tests'),
  utils: path.join(rootDir, 'utils'),
  testdata: path.join(rootDir, 'testdata')
};

const outputFile = path.join(rootDir, 'OpenCart_Playwright_Report.pdf');

// ---------------- FONTS (Times New Roman) ----------------
const regularFont = 'C:/Windows/Fonts/times.ttf';
const boldFont = 'C:/Windows/Fonts/timesbd.ttf';
const italicFont = 'C:/Windows/Fonts/timesi.ttf';
const boldItalicFont = 'C:/Windows/Fonts/timesbi.ttf';

// Create PDF
const doc = new PDFDocument({ margin: 50, size: 'A4' });
doc.pipe(fs.createWriteStream(outputFile));

// Register fonts
doc.registerFont('Times-Roman', regularFont);
doc.registerFont('Times-Bold', boldFont);
doc.registerFont('Times-Italic', italicFont);
doc.registerFont('Times-BoldItalic', boldItalicFont);

// -------- FUNCTION TO READ FILES --------
function getFiles(folderPath, type, extensions) {
  if (!fs.existsSync(folderPath)) return [];

  return fs.readdirSync(folderPath)
    .filter(file => extensions.some(ext => file.endsWith(ext)))
    .map(file => ({
      name: file,
      path: path.join(folderPath, file),
      type
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// -------- ROOT FILES (CONFIG) --------
const rootFilesList = [
  { name: 'package.json', type: 'Config' },
  { name: 'test.config.ts', type: 'Config' },
  { name: 'playwright.config.ts', type: 'Config' }
];

const rootFiles = rootFilesList
  .map(file => {
    const filePath = path.join(rootDir, file.name);
    if (fs.existsSync(filePath)) {
      return {
        name: file.name,
        path: filePath,
        type: file.type
      };
    }
    return null;
  })
  .filter(Boolean);

// -------- COLLECT FILES --------
const pageFiles = getFiles(folders.pages, 'Page', ['.ts']);
const testFiles = getFiles(folders.tests, 'Test', ['.spec.ts']);
const utilFiles = getFiles(folders.utils, 'Util', ['.ts']);
const dataFiles = getFiles(folders.testdata, 'Data', ['.json', '.csv']);

// Final order
const files = [
  ...rootFiles,
  ...pageFiles,
  ...testFiles,
  ...utilFiles,
  ...dataFiles
];

const totalFiles = files.length;

// ---------------- TITLE PAGE ----------------
doc.font('Times-Bold')
   .fontSize(20)
   .text('OpenCart Playwright Automation Report', { align: 'center' });

doc.moveDown(1);

doc.font('Times-Roman')
   .fontSize(14)
   .text(`Total Files: ${totalFiles}`, { align: 'center' });

doc.addPage();

// ---------------- INDEX ----------------
doc.font('Times-Bold')
   .fontSize(18)
   .text('Index', { underline: true });

doc.moveDown(1);

files.forEach((file, index) => {
  const destination = `file_${index}`;

  doc.font('Times-Roman')
     .fontSize(12)
     .fillColor('blue')
     .text(`${index + 1}. [${file.type}] ${file.name}`, {
        goTo: destination,
        underline: true
     });

  doc.moveDown(0.5);
});

doc.fillColor('black');

// ---------------- CONTENT ----------------
let currentSection = '';

files.forEach((file, index) => {

  // Section header
  if (file.type !== currentSection) {
    doc.addPage();

    doc.font('Times-Bold')
       .fontSize(16)
       .text(`--- ${file.type.toUpperCase()} FILES ---`, { align: 'center' });

    doc.moveDown(2);

    currentSection = file.type;
  }

  const content = fs.readFileSync(file.path, 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  doc.addPage();

  const destination = `file_${index}`;
  doc.addNamedDestination(destination);

  // File header
  doc.font('Times-Bold')
     .fontSize(14)
     .text(`${index + 1}. [${file.type}] ${file.name}`, { underline: true });

  doc.moveDown(1);

  doc.font('Times-Roman')
     .fontSize(10);

  const lines = content.split('\n');

  lines.forEach(line => {
    doc.text(line, { lineGap: 2 });
  });
});

doc.end();

console.log('✅ Final PDF Generated (Professional Report with Times New Roman)');


//to execute this script, 
//run: node generate/generate-pdf.js