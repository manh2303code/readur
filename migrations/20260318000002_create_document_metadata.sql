CREATE TABLE IF NOT EXISTS document_metadata (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    so_hieu VARCHAR(100),
    ngay_ban_hanh DATE,
    co_quan_ban_hanh VARCHAR(255),
    dia_danh VARCHAR(100),
    loai_van_ban VARCHAR(50) CHECK (loai_van_ban IN (
        'Quyet dinh', 'Cong van', 'Thong bao', 'Nghi dinh',
        'Chi thi', 'Bao cao', 'To trinh', 'Ke hoach',
        'Huong dan', 'Bien ban', 'Thong tu', 'Nghi quyet'
    )),
    nguoi_ky VARCHAR(255),
    do_mat VARCHAR(20) CHECK (do_mat IN ('Thuong', 'Mat', 'Toi mat', 'Tuyet mat')),
    do_khan VARCHAR(20) CHECK (do_khan IN ('Thuong', 'Khan', 'Thuong khan', 'Hoa toc')),
    linh_vuc VARCHAR(100),
    trich_yeu TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for all filterable fields
CREATE INDEX idx_document_metadata_loai_van_ban ON document_metadata(loai_van_ban);
CREATE INDEX idx_document_metadata_ngay_ban_hanh ON document_metadata(ngay_ban_hanh);
CREATE INDEX idx_document_metadata_co_quan ON document_metadata(co_quan_ban_hanh);
CREATE INDEX idx_document_metadata_linh_vuc ON document_metadata(linh_vuc);
CREATE INDEX idx_document_metadata_do_mat ON document_metadata(do_mat);
CREATE INDEX idx_document_metadata_do_khan ON document_metadata(do_khan);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_document_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_document_metadata_updated_at
    BEFORE UPDATE ON document_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_document_metadata_updated_at();
