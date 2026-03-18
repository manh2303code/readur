use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, put},
    Router,
};
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    auth::AuthUser,
    db::document_metadata,
    models::document_metadata::{DocumentMetadata, UpdateDocumentMetadataRequest},
    AppState,
};

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/{document_id}/metadata", get(get_metadata).put(update_metadata))
}

async fn get_metadata(
    State(state): State<Arc<AppState>>,
    _auth_user: AuthUser,
    Path(document_id): Path<Uuid>,
) -> Result<Json<Option<DocumentMetadata>>, (StatusCode, Json<serde_json::Value>)> {
    match document_metadata::get_metadata(&state.db.pool, document_id).await {
        Ok(metadata) => Ok(Json(metadata)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": e.to_string() })),
        )),
    }
}

async fn update_metadata(
    State(state): State<Arc<AppState>>,
    _auth_user: AuthUser,
    Path(document_id): Path<Uuid>,
    Json(req): Json<UpdateDocumentMetadataRequest>,
) -> Result<Json<DocumentMetadata>, (StatusCode, Json<serde_json::Value>)> {
    if let Err(e) = req.validate() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": e })),
        ));
    }

    match document_metadata::upsert_metadata(&state.db.pool, document_id, &req).await {
        Ok(metadata) => Ok(Json(metadata)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": e.to_string() })),
        )),
    }
}
