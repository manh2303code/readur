CREATE TABLE IF NOT EXISTS document_search_index (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    search_text_unaccent TEXT,
    metadata_text_unaccent TEXT
);

-- GIN indexes for trigram search
CREATE INDEX idx_search_text_unaccent_trgm
    ON document_search_index USING gin (search_text_unaccent gin_trgm_ops);
CREATE INDEX idx_metadata_text_unaccent_trgm
    ON document_search_index USING gin (metadata_text_unaccent gin_trgm_ops);

-- Trigger: update search_text_unaccent when document OCR text changes
CREATE OR REPLACE FUNCTION update_search_text_unaccent()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO document_search_index (document_id, search_text_unaccent)
    VALUES (NEW.id, unaccent(COALESCE(NEW.ocr_text, '')))
    ON CONFLICT (document_id)
    DO UPDATE SET search_text_unaccent = unaccent(COALESCE(NEW.ocr_text, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_text_unaccent
    AFTER INSERT OR UPDATE OF ocr_text ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_search_text_unaccent();

-- Trigger: update metadata_text_unaccent when metadata changes
CREATE OR REPLACE FUNCTION update_metadata_text_unaccent()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO document_search_index (document_id, metadata_text_unaccent)
    VALUES (NEW.document_id, unaccent(
        COALESCE(NEW.trich_yeu, '') || ' ' ||
        COALESCE(NEW.co_quan_ban_hanh, '') || ' ' ||
        COALESCE(NEW.nguoi_ky, '') || ' ' ||
        COALESCE(NEW.linh_vuc, '')
    ))
    ON CONFLICT (document_id)
    DO UPDATE SET metadata_text_unaccent = unaccent(
        COALESCE(NEW.trich_yeu, '') || ' ' ||
        COALESCE(NEW.co_quan_ban_hanh, '') || ' ' ||
        COALESCE(NEW.nguoi_ky, '') || ' ' ||
        COALESCE(NEW.linh_vuc, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_metadata_text_unaccent
    AFTER INSERT OR UPDATE ON document_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_metadata_text_unaccent();

-- Backfill: populate search index for existing documents
INSERT INTO document_search_index (document_id, search_text_unaccent)
SELECT id, unaccent(COALESCE(ocr_text, ''))
FROM documents
WHERE ocr_text IS NOT NULL
ON CONFLICT (document_id) DO NOTHING;
