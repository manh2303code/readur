import api from './api'
import type { DocumentMetadata, UpdateDocumentMetadataRequest } from '../types/documentMetadata'

export async function getDocumentMetadata(documentId: string): Promise<DocumentMetadata | null> {
  const { data } = await api.get<DocumentMetadata | null>(`/documents/${documentId}/metadata`)
  return data
}

export async function updateDocumentMetadata(
  documentId: string,
  metadata: UpdateDocumentMetadataRequest
): Promise<DocumentMetadata> {
  const { data } = await api.put<DocumentMetadata>(`/documents/${documentId}/metadata`, metadata)
  return data
}
