import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  TextField,
  Grid,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DocumentMetadata, UpdateDocumentMetadataRequest } from '../../types/documentMetadata'
import { LOAI_VAN_BAN_OPTIONS, DO_MAT_OPTIONS, DO_KHAN_OPTIONS } from '../../types/documentMetadata'
import { updateDocumentMetadata } from '../../services/documentMetadataApi'

interface MetadataFormProps {
  documentId: string
  initialData?: DocumentMetadata | null
  onSave?: () => void
  onCancel?: () => void
}

const MetadataForm: React.FC<MetadataFormProps> = ({
  documentId,
  initialData,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<UpdateDocumentMetadataRequest>({
    so_hieu: initialData?.so_hieu ?? null,
    ngay_ban_hanh: initialData?.ngay_ban_hanh ?? null,
    co_quan_ban_hanh: initialData?.co_quan_ban_hanh ?? null,
    dia_danh: initialData?.dia_danh ?? null,
    loai_van_ban: initialData?.loai_van_ban ?? null,
    nguoi_ky: initialData?.nguoi_ky ?? null,
    do_mat: initialData?.do_mat ?? null,
    do_khan: initialData?.do_khan ?? null,
    linh_vuc: initialData?.linh_vuc ?? null,
    trich_yeu: initialData?.trich_yeu ?? null,
  })

  const [saving, setSaving] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const handleTextChange = (field: keyof UpdateDocumentMetadataRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormData(prev => ({ ...prev, [field]: value || null }))
    }

  const handleSelectChange = (field: keyof UpdateDocumentMetadataRequest) =>
    (event: { target: { value: string } }) => {
      const value = event.target.value
      setFormData(prev => ({ ...prev, [field]: value || null }))
    }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateDocumentMetadata(documentId, formData)
      setSnackbarMessage(t('common.status.success'))
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      onSave?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.status.error')
      setSnackbarMessage(message)
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('metadata.soHieu')}
            value={formData.so_hieu ?? ''}
            onChange={handleTextChange('so_hieu')}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('metadata.ngayBanHanh')}
            type="date"
            value={formData.ngay_ban_hanh ?? ''}
            onChange={handleTextChange('ngay_ban_hanh')}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('metadata.coQuanBanHanh')}
            value={formData.co_quan_ban_hanh ?? ''}
            onChange={handleTextChange('co_quan_ban_hanh')}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('metadata.diaDanh')}
            value={formData.dia_danh ?? ''}
            onChange={handleTextChange('dia_danh')}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('metadata.loaiVanBan')}</InputLabel>
            <Select
              value={formData.loai_van_ban ?? ''}
              label={t('metadata.loaiVanBan')}
              onChange={handleSelectChange('loai_van_ban')}
            >
              <MenuItem value=""><em>—</em></MenuItem>
              {LOAI_VAN_BAN_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>
                  {t(`metadata.loaiVanBanOptions.${option}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('metadata.nguoiKy')}
            value={formData.nguoi_ky ?? ''}
            onChange={handleTextChange('nguoi_ky')}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('metadata.doMat')}</InputLabel>
            <Select
              value={formData.do_mat ?? ''}
              label={t('metadata.doMat')}
              onChange={handleSelectChange('do_mat')}
            >
              <MenuItem value=""><em>—</em></MenuItem>
              {DO_MAT_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>
                  {t(`metadata.doMatOptions.${option}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('metadata.doKhan')}</InputLabel>
            <Select
              value={formData.do_khan ?? ''}
              label={t('metadata.doKhan')}
              onChange={handleSelectChange('do_khan')}
            >
              <MenuItem value=""><em>—</em></MenuItem>
              {DO_KHAN_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>
                  {t(`metadata.doKhanOptions.${option}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('metadata.linhVuc')}
            value={formData.linh_vuc ?? ''}
            onChange={handleTextChange('linh_vuc')}
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('metadata.trichYeu')}
            value={formData.trich_yeu ?? ''}
            onChange={handleTextChange('trich_yeu')}
            size="small"
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={saving}>
            {t('common.actions.cancel')}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : undefined}
        >
          {saving ? t('common.status.processing') : t('common.actions.save')}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MetadataForm
