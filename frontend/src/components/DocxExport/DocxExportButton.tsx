import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import DocxPreviewDialog from './DocxPreviewDialog'
import type { DocumentMetadata } from '../../types/documentMetadata'

interface DocxExportButtonProps {
  metadata: DocumentMetadata | null
  ocrText: string
}

const DocxExportButton: React.FC<DocxExportButtonProps> = ({ metadata, ocrText }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  if (!metadata) return null

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownload />}
        onClick={() => setOpen(true)}
      >
        {t('docxExport.exportButton')}
      </Button>
      <DocxPreviewDialog
        open={open}
        onClose={() => setOpen(false)}
        metadata={metadata}
        ocrText={ocrText}
      />
    </>
  )
}

export default DocxExportButton
