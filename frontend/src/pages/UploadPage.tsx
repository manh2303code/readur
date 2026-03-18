import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  List,
  ListItem,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import Grid from '@mui/material/GridLegacy';
import {
  CloudUpload as UploadIcon,
  AutoAwesome as AutoIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import UploadZone from '../components/Upload/UploadZone';
import { useNavigate } from 'react-router-dom';
import type { UpdateDocumentMetadataRequest } from '../types/documentMetadata';
import { LOAI_VAN_BAN_OPTIONS, DO_MAT_OPTIONS, DO_KHAN_OPTIONS } from '../types/documentMetadata';
import { updateDocumentMetadata } from '../services/documentMetadataApi';

interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

interface UploadedDocument {
  id: string;
  original_filename: string;
  filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

const EMPTY_METADATA: UpdateDocumentMetadataRequest = {
  so_hieu: null,
  ngay_ban_hanh: null,
  co_quan_ban_hanh: null,
  dia_danh: null,
  loai_van_ban: null,
  nguoi_ky: null,
  do_mat: null,
  do_khan: null,
  linh_vuc: null,
  trich_yeu: null,
};

const hasAnyMetadata = (data: UpdateDocumentMetadataRequest): boolean =>
  Object.values(data).some(v => v !== null && v !== '' && v !== undefined);

const UploadPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [metadataFormData, setMetadataFormData] =
    useState<UpdateDocumentMetadataRequest>({ ...EMPTY_METADATA });

  const features: Feature[] = [
    {
      icon: AutoIcon,
      title: t('upload.features.aiOcr.title'),
      description: t('upload.features.aiOcr.description'),
    },
    {
      icon: SearchIcon,
      title: t('upload.features.fullTextSearch.title'),
      description: t('upload.features.fullTextSearch.description'),
    },
    {
      icon: SpeedIcon,
      title: t('upload.features.lightningFast.title'),
      description: t('upload.features.lightningFast.description'),
    },
    {
      icon: SecurityIcon,
      title: t('upload.features.secure.title'),
      description: t('upload.features.secure.description'),
    },
    {
      icon: LanguageIcon,
      title: t('upload.features.multiLanguage.title'),
      description: t('upload.features.multiLanguage.description'),
    },
  ];

  const handleTextChange =
    (field: keyof UpdateDocumentMetadataRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setMetadataFormData(prev => ({ ...prev, [field]: value || null }));
    };

  const handleSelectChange =
    (field: keyof UpdateDocumentMetadataRequest) =>
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setMetadataFormData(prev => ({ ...prev, [field]: value || null }));
    };

  const handleUploadComplete = async (document: UploadedDocument): Promise<void> => {
    if (hasAnyMetadata(metadataFormData)) {
      try {
        await updateDocumentMetadata(document.id, metadataFormData);
      } catch (err) {
        console.error('Failed to save metadata for document:', document.id, err);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('upload.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('upload.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Upload Zone */}
        <Grid item xs={12} lg={8}>
          <UploadZone onUploadComplete={handleUploadComplete} />

          {/* Optional Metadata Accordion */}
          <Accordion
            defaultExpanded={false}
            sx={{ mt: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('metadata.title')}{' '}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                >
                  (tùy chọn)
                </Typography>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('metadata.soHieu')}
                    value={metadataFormData.so_hieu ?? ''}
                    onChange={handleTextChange('so_hieu')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('metadata.ngayBanHanh')}
                    type="date"
                    value={metadataFormData.ngay_ban_hanh ?? ''}
                    onChange={handleTextChange('ngay_ban_hanh')}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('metadata.coQuanBanHanh')}
                    value={metadataFormData.co_quan_ban_hanh ?? ''}
                    onChange={handleTextChange('co_quan_ban_hanh')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('metadata.diaDanh')}
                    value={metadataFormData.dia_danh ?? ''}
                    onChange={handleTextChange('dia_danh')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('metadata.loaiVanBan')}</InputLabel>
                    <Select
                      value={metadataFormData.loai_van_ban ?? ''}
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
                    value={metadataFormData.nguoi_ky ?? ''}
                    onChange={handleTextChange('nguoi_ky')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('metadata.doMat')}</InputLabel>
                    <Select
                      value={metadataFormData.do_mat ?? ''}
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
                      value={metadataFormData.do_khan ?? ''}
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
                    value={metadataFormData.linh_vuc ?? ''}
                    onChange={handleTextChange('linh_vuc')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('metadata.trichYeu')}
                    value={metadataFormData.trich_yeu ?? ''}
                    onChange={handleTextChange('trich_yeu')}
                    size="small"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Features Sidebar */}
        <Grid item xs={12} lg={4}>

          {/* Tips Card */}
          <Card elevation={0} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('upload.tips.title')}
              </Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ px: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('upload.tips.highRes')}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('upload.tips.pdfText')}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('upload.tips.clarity')}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('upload.tips.maxSize')}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UploadPage;
