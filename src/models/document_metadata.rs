use chrono::{NaiveDate, DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentMetadata {
    pub document_id: Uuid,
    pub so_hieu: Option<String>,
    pub ngay_ban_hanh: Option<NaiveDate>,
    pub co_quan_ban_hanh: Option<String>,
    pub dia_danh: Option<String>,
    pub loai_van_ban: Option<String>,
    pub nguoi_ky: Option<String>,
    pub do_mat: Option<String>,
    pub do_khan: Option<String>,
    pub linh_vuc: Option<String>,
    pub trich_yeu: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Default, Deserialize)]
pub struct UpdateDocumentMetadataRequest {
    pub so_hieu: Option<String>,
    pub ngay_ban_hanh: Option<NaiveDate>,
    pub co_quan_ban_hanh: Option<String>,
    pub dia_danh: Option<String>,
    pub loai_van_ban: Option<String>,
    pub nguoi_ky: Option<String>,
    pub do_mat: Option<String>,
    pub do_khan: Option<String>,
    pub linh_vuc: Option<String>,
    pub trich_yeu: Option<String>,
}

const VALID_LOAI_VAN_BAN: &[&str] = &[
    "Quyet dinh", "Cong van", "Thong bao", "Nghi dinh",
    "Chi thi", "Bao cao", "To trinh", "Ke hoach",
    "Huong dan", "Bien ban", "Thong tu", "Nghi quyet",
];

const VALID_DO_MAT: &[&str] = &["Thuong", "Mat", "Toi mat", "Tuyet mat"];
const VALID_DO_KHAN: &[&str] = &["Thuong", "Khan", "Thuong khan", "Hoa toc"];

impl UpdateDocumentMetadataRequest {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(ref s) = self.so_hieu {
            if s.chars().count() > 100 {
                return Err("so_hieu must be at most 100 characters".into());
            }
        }
        if let Some(ref d) = self.ngay_ban_hanh {
            if *d > Utc::now().date_naive() {
                return Err("ngay_ban_hanh must not be in the future".into());
            }
        }
        if let Some(ref s) = self.co_quan_ban_hanh {
            if s.chars().count() > 255 {
                return Err("co_quan_ban_hanh must be at most 255 characters".into());
            }
        }
        if let Some(ref s) = self.dia_danh {
            if s.chars().count() > 100 {
                return Err("dia_danh must be at most 100 characters".into());
            }
        }
        if let Some(ref s) = self.loai_van_ban {
            if !VALID_LOAI_VAN_BAN.contains(&s.as_str()) {
                return Err(format!("Invalid loai_van_ban: {}", s));
            }
        }
        if let Some(ref s) = self.do_mat {
            if !VALID_DO_MAT.contains(&s.as_str()) {
                return Err(format!("Invalid do_mat: {}", s));
            }
        }
        if let Some(ref s) = self.do_khan {
            if !VALID_DO_KHAN.contains(&s.as_str()) {
                return Err(format!("Invalid do_khan: {}", s));
            }
        }
        if let Some(ref s) = self.linh_vuc {
            if s.chars().count() > 100 {
                return Err("linh_vuc must be at most 100 characters".into());
            }
        }
        if let Some(ref s) = self.nguoi_ky {
            if s.chars().count() > 255 {
                return Err("nguoi_ky must be at most 255 characters".into());
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_valid_request() {
        let req = UpdateDocumentMetadataRequest {
            so_hieu: Some("123/QĐ-UBND".into()),
            loai_van_ban: Some("Quyet dinh".into()),
            do_mat: Some("Thuong".into()),
            do_khan: Some("Thuong".into()),
            ..Default::default()
        };
        assert!(req.validate().is_ok());
    }

    #[test]
    fn test_validate_invalid_loai_van_ban() {
        let req = UpdateDocumentMetadataRequest {
            loai_van_ban: Some("Invalid".into()),
            ..Default::default()
        };
        assert!(req.validate().is_err());
    }

    #[test]
    fn test_validate_so_hieu_too_long() {
        let req = UpdateDocumentMetadataRequest {
            so_hieu: Some("x".repeat(101)),
            ..Default::default()
        };
        assert!(req.validate().is_err());
    }

    #[test]
    fn test_validate_future_date_rejected() {
        let req = UpdateDocumentMetadataRequest {
            ngay_ban_hanh: Some(Utc::now().date_naive() + chrono::Duration::days(1)),
            ..Default::default()
        };
        assert!(req.validate().is_err());
    }
}
