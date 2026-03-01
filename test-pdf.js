const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function testPdf() {
    try {
        console.log("pdfjsLib loaded version:", pdfjsLib.version);
        // create a dummy pdf to test or just verify it doesn't crash on import
        console.log("Success! pdfjs-dist can be imported normally in Node.");
    } catch (e) {
        console.error("Error:", e);
    }
}
testPdf();
