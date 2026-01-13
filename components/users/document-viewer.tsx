"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Image as ImageIcon,
  File,
  Calendar,
  User,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { downloadDocument } from "@/lib/storage"
import { StorageDocument } from "@/types/verification"
import { cn } from "@/lib/utils"

interface DocumentViewerProps {
  documents: StorageDocument[]
  documentType: string
  onApprove?: (documentId: string) => void
  onReject?: (documentId: string) => void
  showActions?: boolean
}

interface DocumentModalProps {
  document: StorageDocument | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (document: StorageDocument) => void
}

const DocumentModal = ({ document, isOpen, onClose, onDownload }: DocumentModalProps) => {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  if (!document) return null

  const handleDownload = async () => {
    if (onDownload) {
      setIsLoading(true)
      try {
        await onDownload(document)
      } catch (error: any) {
        console.error('❌ Erro ao baixar documento:', {
          code: error?.code,
          message: error?.message,
          documentName: document.name
        })
        // Se a URL não funcionar, tenta abrir em nova aba
        if (document.url) {
          window.open(document.url, '_blank')
        }
      } finally {
        setIsLoading(false)
      }
    } else if (document.url) {
      // Fallback: abrir em nova aba se não houver handler
      window.open(document.url, '_blank')
    }
  }

  const resetView = () => {
    setZoom(100)
    setRotation(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Controles */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(300, zoom + 25))}
                disabled={zoom >= 300}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((rotation + 90) % 360)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
              >
                Reset
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? 'Baixando...' : 'Baixar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.url, '_blank')}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Abrir em Nova Aba
              </Button>
            </div>
          </div>

          {/* Visualização do documento */}
          <div className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden min-h-[400px]">
            {document.type === 'image' && document.url ? (
              <img
                src={document.url}
                alt={document.name}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  const parent = target.parentElement
                  
                  console.error('❌ Erro ao carregar imagem:', {
                    url: document.url,
                    name: document.name
                  })
                  
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center p-8 w-full">
                        <div class="w-16 h-16 mx-auto mb-4 text-orange-400">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                        <p class="text-orange-600 font-medium mb-2">Não foi possível carregar a imagem</p>
                        <p class="text-sm text-gray-500 mb-4">O arquivo pode ter sido removido ou não está mais acessível</p>
                        <div class="flex gap-2 justify-center">
                          <button onclick="window.open('${document.url}', '_blank')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                            Tentar abrir em nova aba
                          </button>
                        </div>
                      </div>
                    `
                  }
                }}
                onLoad={() => {
                  console.log('✅ Imagem carregada no modal:', document.name)
                }}
              />
            ) : !document.url ? (
              <div className="text-center p-8 w-full">
                <AlertCircle className="h-16 w-16 mx-auto text-orange-400 mb-4" />
                <p className="text-orange-600 font-medium mb-2">URL do documento não disponível</p>
                <p className="text-sm text-gray-500">O documento pode ter sido removido ou não está mais acessível no Storage</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Visualização não disponível para este tipo de arquivo</p>
                <Button onClick={handleDownload} disabled={isLoading || !document.url}>
                  <Download className="h-4 w-4 mr-2" />
                  {isLoading ? 'Baixando...' : 'Baixar Arquivo'}
                </Button>
                {document.url && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(document.url, '_blank')}
                    className="ml-2"
                  >
                    Abrir em Nova Aba
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Informações do documento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Tamanho</p>
              <p>{formatFileSize(document.size)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Tipo</p>
              <p className="capitalize">{document.type}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Enviado</p>
              <p>{formatDistanceToNow(document.uploadedAt, { addSuffix: true, locale: ptBR })}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Nome do arquivo</p>
              <p className="truncate" title={document.name}>{document.name}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getDocumentTypeIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="h-4 w-4" />
    case 'pdf':
      return <FileText className="h-4 w-4" />
    default:
      return <File className="h-4 w-4" />
  }
}

const getDocumentTypeColor = (type: string) => {
  switch (type) {
    case 'image':
      return 'bg-blue-100 text-blue-800'
    case 'pdf':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const DocumentViewer = ({ 
  documents, 
  documentType, 
  onApprove, 
  onReject, 
  showActions = true 
}: DocumentViewerProps) => {
  const [selectedDocument, setSelectedDocument] = useState<StorageDocument | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDocument = (document: StorageDocument) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  const handleDownloadDocument = async (document: StorageDocument) => {
    if (!document.url) {
      console.error('❌ URL do documento não disponível:', document.name)
      return
    }
    
    try {
      await downloadDocument(document.url, document.name)
    } catch (error: any) {
      console.error('❌ Erro ao baixar documento:', {
        code: error?.code,
        message: error?.message,
        documentName: document.name,
        url: document.url
      })
      
      // Fallback: tentar abrir em nova aba se o download falhar
      if (document.url) {
        window.open(document.url, '_blank')
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDocument(null)
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhum documento encontrado</p>
          <p className="text-sm text-gray-500">Este tipo de documento ainda não foi enviado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
          {getDocumentTypeIcon(documentType)}
          {documentType.replace('_', ' ')}
        </h3>
        <Badge variant="outline" className="flex items-center gap-1">
          {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              {/* Preview do documento */}
              <div className="relative">
                {document.type === 'image' && document.url ? (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                       onClick={() => handleViewDocument(document)}>
                    <img
                      src={document.url}
                      alt={document.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        const parent = target.parentElement
                        
                        console.error('❌ Erro ao carregar preview da imagem:', {
                          url: document.url,
                          name: document.name
                        })
                        
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-orange-50">
                              <div class="text-center p-2">
                                <svg class="w-8 h-8 mx-auto mb-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                <p class="text-xs text-orange-600 font-medium">Imagem não disponível</p>
                                <p class="text-xs text-gray-500">Clique para ver detalhes</p>
                              </div>
                            </div>
                          `
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ Preview da imagem carregado:', document.name)
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                ) : !document.url ? (
                  <div className="aspect-video bg-orange-50 rounded-lg flex items-center justify-center">
                    <div className="text-center p-4">
                      <AlertCircle className="h-10 w-10 mx-auto text-orange-400 mb-2" />
                      <p className="text-xs text-orange-600 font-medium">URL não disponível</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                       onClick={() => handleViewDocument(document)}>
                    <div className="text-center">
                      {getDocumentTypeIcon(document.type)}
                      <p className="text-xs text-gray-600 mt-2">Clique para visualizar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do documento */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate" title={document.name}>
                    {document.name}
                  </p>
                  <Badge className={cn("text-xs", getDocumentTypeColor(document.type))}>
                    {document.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(document.uploadedAt, { addSuffix: true, locale: ptBR })}
                  </div>
                  <div>{formatFileSize(document.size)}</div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDocument(document)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadDocument(document)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>

              {/* Ações de aprovação/rejeição */}
              {showActions && onApprove && onReject && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    onClick={() => onApprove(document.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onReject(document.id)}
                    className="flex-1"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de visualização */}
      <DocumentModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={handleDownloadDocument}
      />
    </div>
  )
}
