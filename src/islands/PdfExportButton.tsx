import React from 'react';

const PdfExportButton: React.FC = () => {
  const handleExport = () => {
    window.print();
  };

  return (
    <button className="btn secondary" type="button" onClick={handleExport}>
      Export as PDF
    </button>
  );
};

export default PdfExportButton;
