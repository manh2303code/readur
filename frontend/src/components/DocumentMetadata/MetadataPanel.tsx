import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { DocumentMetadata } from '../../types/documentMetadata'
import { getDocumentMetadata } from '../../services/documentMetadataApi'
import MetadataForm from './MetadataForm'

interface MetadataPanelProps {
  documentId: string
}

interface FieldRowProps {
  label: string
  value: React.ReactNode
}

const FieldRow: React.FC<FieldRowProps> = ({ label, value }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1.5 }}>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </Typography>
    <Box sx={{ mt: 0.25 }}>
      {value}
    </Box>
  </Box>
)

const doMatColor = (value: string): 'default' | 'error' | 'warning' => {
  if (value === 'Tuyet mat') return 'error'
  if (value === 'Toi mat') return 'warning'
  return 'default'
}

const doKhanColor = (value: string): 'default' | 'warning' => {
  if (value === 'Hoa toc') return 'warning'
  return 'default'
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({ documentId }) => {
  const { t } = useTranslation()

  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const fetchMetadata = async () => {
    setLoading(true)
    try {
      const data = await getDocumentMetadata(documentId)
      setMetadata(data)
    } catch {
      setMetadata(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetadata()
  }, [documentId])

  const handleSave = () => {
    setEditing(false)
    fetchMetadata()
  }

  const handleCancel = () => {
    setEditing(false)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (editing) {
    return (
      <Box>
        <MetadataForm
          documentId={documentId}
          initialData={metadata}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>
    )
  }

  if (!metadata) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('metadata.noData', 'Chưa có thông tin văn bản')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setEditing(true)}
        >
          {t('common.actions.edit')}
        </Button>
      </Box>
    )
  }

  const textValue = (val: string | null) =>
    val ? (
      <Typography variant="body2">{val}</Typography>
    ) : (
      <Typography variant="body2" color="text.disabled">—</Typography>
    )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => setEditing(true)}
        >
          {t('common.actions.edit')}
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.soHieu')}
            value={textValue(metadata.so_hieu)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.ngayBanHanh')}
            value={textValue(metadata.ngay_ban_hanh)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.coQuanBanHanh')}
            value={textValue(metadata.co_quan_ban_hanh)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.diaDanh')}
            value={textValue(metadata.dia_danh)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.loaiVanBan')}
            value={
              metadata.loai_van_ban ? (
                <Typography variant="body2">
                  {t(`metadata.loaiVanBanOptions.${metadata.loai_van_ban}`, metadata.loai_van_ban)}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.disabled">—</Typography>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.nguoiKy')}
            value={textValue(metadata.nguoi_ky)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.doMat')}
            value={
              metadata.do_mat ? (
                <Chip
                  label={t(`metadata.doMatOptions.${metadata.do_mat}`, metadata.do_mat)}
                  size="small"
                  color={doMatColor(metadata.do_mat)}
                />
              ) : (
                <Typography variant="body2" color="text.disabled">—</Typography>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.doKhan')}
            value={
              metadata.do_khan ? (
                <Chip
                  label={t(`metadata.doKhanOptions.${metadata.do_khan}`, metadata.do_khan)}
                  size="small"
                  color={doKhanColor(metadata.do_khan)}
                />
              ) : (
                <Typography variant="body2" color="text.disabled">—</Typography>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FieldRow
            label={t('metadata.linhVuc')}
            value={textValue(metadata.linh_vuc)}
          />
        </Grid>

        <Grid item xs={12}>
          <FieldRow
            label={t('metadata.trichYeu')}
            value={
              metadata.trich_yeu ? (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {metadata.trich_yeu}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.disabled">—</Typography>
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default MetadataPanel
