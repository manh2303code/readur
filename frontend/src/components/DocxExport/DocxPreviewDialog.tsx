import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { Packer } from 'docx'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { generateAdminDocument } from './DocxTemplateEngine'
import type { DocumentMetadata } from '../../types/documentMetadata'

interface DocxPreviewDialogProps {
  open: boolean
  onClose: () => void
  metadata: DocumentMetadata
  ocrText: string
}

const DocxPreviewDialog: React.FC<DocxPreviewDialogProps> = ({
  open,
  onClose,
  metadata,
  ocrText,
}) => {
  const { t } = useTranslation()
  const [editedContent, setEditedContent] = useState<string>(ocrText)
  const [noiNhanRaw, setNoiNhanRaw] = useState<string>('Như trên, Lưu: VT')
  const [downloading, setDownloading] = useState<boolean>(false)

  const handleDownload = async (): Promise<void> => {
    setDownloading(true)
    try {
      const noiNhanList = noiNhanRaw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const doc = generateAdminDocument({
        metadata,
        content: editedContent,
        noiNhan: noiNhanList,
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${metadata.so_hieu || 'document'}.docx`)
    } catch (err) {
      console.error('DOCX generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('docxExport.previewTitle')}</DialogTitle>

      <DialogContent dividers>
        {/* Read-only metadata summary */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'text.secondary' }}
        >
          {t('docxExport.metadataSection')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          <Typography variant="body2">
            <strong>{t('docxExport.soHieu')}:</strong> {metadata.so_hieu || '—'}
          </Typography>
          <Typography variant="body2">
            <strong>{t('docxExport.loaiVanBan')}:</strong> {metadata.loai_van_ban || '—'}
          </Typography>
          <Typography variant="body2">
            <strong>{t('docxExport.coQuanBanHanh')}:</strong> {metadata.co_quan_ban_hanh || '—'}
          </Typography>
          <Typography variant="body2">
            <strong>{t('docxExport.ngayBanHanh')}:</strong> {metadata.ngay_ban_hanh || '—'}
          </Typography>
          <Typography variant="body2">
            <strong>{t('docxExport.nguoiKy')}:</strong> {metadata.nguoi_ky || '—'}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: '1 / -1' }}>
            <strong>{t('docxExport.trichYeu')}:</strong> {metadata.trich_yeu || '—'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Editable content */}
        <TextField
          label={t('docxExport.editContent')}
          multiline
          minRows={8}
          maxRows={20}
          fullWidth
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        {/* Editable recipients */}
        <TextField
          label={t('docxExport.noiNhanLabel')}
          fullWidth
          value={noiNhanRaw}
          onChange={(e) => setNoiNhanRaw(e.target.value)}
          variant="outlined"
          helperText={t('docxExport.noiNhan')}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={downloading}>
          {t('common.actions.cancel')}
        </Button>
        <Button
          variant="contained"
          startIcon={downloading ? <CircularProgress size={16} /> : <FileDownload />}
          onClick={handleDownload}
          disabled={downloading}
        >
          {t('docxExport.downloadDocx')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocxPreviewDialog
