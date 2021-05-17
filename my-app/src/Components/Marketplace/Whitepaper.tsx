import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function range(start: number, end: number) {
  var ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
}

function Sample() {
  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess() {
    setNumPages(numPages);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} >
      <Document
        file="./Whitepaper.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {range(1, 16).map(page => (
          <Page pageNumber={page} />
        ))}
      </Document>
    </div >
  );
}

export default Sample;