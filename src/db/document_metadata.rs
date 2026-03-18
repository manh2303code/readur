use sqlx::PgPool;
use uuid::Uuid;

use crate::models::document_metadata::{DocumentMetadata, UpdateDocumentMetadataRequest};

pub async fn get_metadata(pool: &PgPool, document_id: Uuid) -> Result<Option<DocumentMetadata>, sqlx::Error> {
    sqlx::query_as::<_, DocumentMetadata>(
        "SELECT * FROM document_metadata WHERE document_id = $1"
    )
    .bind(document_id)
    .fetch_optional(pool)
    .await
}

pub async fn upsert_metadata(
    pool: &PgPool,
    document_id: Uuid,
    req: &UpdateDocumentMetadataRequest,
) -> Result<DocumentMetadata, sqlx::Error> {
    sqlx::query_as::<_, DocumentMetadata>(
        r#"
        INSERT INTO document_metadata (
            document_id, so_hieu, ngay_ban_hanh, co_quan_ban_hanh, dia_danh,
            loai_van_ban, nguoi_ky, do_mat, do_khan, linh_vuc, trich_yeu
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (document_id) DO UPDATE SET
            so_hieu = $2,
            ngay_ban_hanh = $3,
            co_quan_ban_hanh = $4,
            dia_danh = $5,
            loai_van_ban = $6,
            nguoi_ky = $7,
            do_mat = $8,
            do_khan = $9,
            linh_vuc = $10,
            trich_yeu = $11,
            updated_at = NOW()
        RETURNING *
        "#,
    )
    .bind(document_id)
    .bind(&req.so_hieu)
    .bind(req.ngay_ban_hanh)
    .bind(&req.co_quan_ban_hanh)
    .bind(&req.dia_danh)
    .bind(&req.loai_van_ban)
    .bind(&req.nguoi_ky)
    .bind(&req.do_mat)
    .bind(&req.do_khan)
    .bind(&req.linh_vuc)
    .bind(&req.trich_yeu)
    .fetch_one(pool)
    .await
}

pub async fn delete_metadata(pool: &PgPool, document_id: Uuid) -> Result<bool, sqlx::Error> {
    let result = sqlx::query("DELETE FROM document_metadata WHERE document_id = $1")
        .bind(document_id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected() > 0)
}
