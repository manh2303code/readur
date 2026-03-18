export interface DocumentMetadata {
  document_id: string
  so_hieu: string | null
  ngay_ban_hanh: string | null
  co_quan_ban_hanh: string | null
  dia_danh: string | null
  loai_van_ban: string | null
  nguoi_ky: string | null
  do_mat: string | null
  do_khan: string | null
  linh_vuc: string | null
  trich_yeu: string | null
  created_at: string
  updated_at: string
}

export interface UpdateDocumentMetadataRequest {
  so_hieu?: string | null
  ngay_ban_hanh?: string | null
  co_quan_ban_hanh?: string | null
  dia_danh?: string | null
  loai_van_ban?: string | null
  nguoi_ky?: string | null
  do_mat?: string | null
  do_khan?: string | null
  linh_vuc?: string | null
  trich_yeu?: string | null
}

export const LOAI_VAN_BAN_OPTIONS = [
  'Quyet dinh', 'Cong van', 'Thong bao', 'Nghi dinh',
  'Chi thi', 'Bao cao', 'To trinh', 'Ke hoach',
  'Huong dan', 'Bien ban', 'Thong tu', 'Nghi quyet',
] as const

export const DO_MAT_OPTIONS = ['Thuong', 'Mat', 'Toi mat', 'Tuyet mat'] as const
export const DO_KHAN_OPTIONS = ['Thuong', 'Khan', 'Thuong khan', 'Hoa toc'] as const
