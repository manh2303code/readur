import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  LOAI_VAN_BAN_OPTIONS,
  DO_MAT_OPTIONS,
  DO_KHAN_OPTIONS,
} from '../../types/documentMetadata'

export interface MetadataSearchFilters {
  loai_van_ban?: string
  co_quan_ban_hanh?: string
  ngay_ban_hanh_from?: string
  ngay_ban_hanh_to?: string
  linh_vuc?: string
  do_mat?: string
  do_khan?: string
}

interface MetadataFiltersProps {
  onFilterChange: (filters: MetadataSearchFilters) => void
  onClear: () => void
}

const EMPTY_FILTERS: MetadataSearchFilters = {
  loai_van_ban: '',
  co_quan_ban_hanh: '',
  ngay_ban_hanh_from: '',
  ngay_ban_hanh_to: '',
  linh_vuc: '',
  do_mat: '',
  do_khan: '',
}

const MetadataFilters: React.FC<MetadataFiltersProps> = ({
  onFilterChange,
  onClear,
}) => {
  const { t } = useTranslation()

  const [filters, setFilters] = useState<MetadataSearchFilters>({ ...EMPTY_FILTERS })

  const handleSelectChange =
    (field: keyof MetadataSearchFilters) =>
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value
      setFilters(prev => ({ ...prev, [field]: value }))
    }

  const handleTextChange =
    (field: keyof MetadataSearchFilters) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setFilters(prev => ({ ...prev, [field]: value }))
    }

  const handleApply = (): void => {
    // Strip empty-string values so callers receive only non-empty filters
    const activeFilters: MetadataSearchFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    )
    onFilterChange(activeFilters)
  }

  const handleClear = (): void => {
    setFilters({ ...EMPTY_FILTERS })
    onClear()
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {t('metadata.title')}
      </Typography>

      <Stack spacing={2}>
        {/* Loai van ban */}
        <FormControl fullWidth size="small">
          <InputLabel>{t('metadata.loaiVanBan')}</InputLabel>
          <Select
            value={filters.loai_van_ban ?? ''}
            label={t('metadata.loaiVanBan')}
            onChange={handleSelectChange('loai_van_ban')}
          >
            <MenuItem value="">
              <em>—</em>
            </MenuItem>
            {LOAI_VAN_BAN_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {t(`metadata.loaiVanBanOptions.${option}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Co quan ban hanh */}
        <TextField
          fullWidth
          size="small"
          label={t('metadata.coQuanBanHanh')}
          value={filters.co_quan_ban_hanh ?? ''}
          onChange={handleTextChange('co_quan_ban_hanh')}
        />

        {/* Ngay ban hanh — from */}
        <TextField
          fullWidth
          size="small"
          type="date"
          label={t('metadata.ngayBanHanhFrom')}
          value={filters.ngay_ban_hanh_from ?? ''}
          onChange={handleTextChange('ngay_ban_hanh_from')}
          InputLabelProps={{ shrink: true }}
        />

        {/* Ngay ban hanh — to */}
        <TextField
          fullWidth
          size="small"
          type="date"
          label={t('metadata.ngayBanHanhTo')}
          value={filters.ngay_ban_hanh_to ?? ''}
          onChange={handleTextChange('ngay_ban_hanh_to')}
          InputLabelProps={{ shrink: true }}
        />

        {/* Linh vuc */}
        <TextField
          fullWidth
          size="small"
          label={t('metadata.linhVuc')}
          value={filters.linh_vuc ?? ''}
          onChange={handleTextChange('linh_vuc')}
        />

        {/* Do mat */}
        <FormControl fullWidth size="small">
          <InputLabel>{t('metadata.doMat')}</InputLabel>
          <Select
            value={filters.do_mat ?? ''}
            label={t('metadata.doMat')}
            onChange={handleSelectChange('do_mat')}
          >
            <MenuItem value="">
              <em>—</em>
            </MenuItem>
            {DO_MAT_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {t(`metadata.doMatOptions.${option}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Do khan */}
        <FormControl fullWidth size="small">
          <InputLabel>{t('metadata.doKhan')}</InputLabel>
          <Select
            value={filters.do_khan ?? ''}
            label={t('metadata.doKhan')}
            onChange={handleSelectChange('do_khan')}
          >
            <MenuItem value="">
              <em>—</em>
            </MenuItem>
            {DO_KHAN_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {t(`metadata.doKhanOptions.${option}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Action buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleApply}
          >
            {t('common.actions.filter')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={handleClear}
          >
            {t('common.actions.clear')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default MetadataFilters
