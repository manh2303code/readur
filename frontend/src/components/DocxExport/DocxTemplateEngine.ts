import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertMillimetersToTwip,
  UnderlineType,
  BorderStyle,
} from 'docx'
import type { TableBorders } from 'docx'
import type { DocumentMetadata } from '../../types/documentMetadata'

export interface DocxExportData {
  metadata: DocumentMetadata
  content: string
  noiNhan: string[]
}

const FONT = 'Times New Roman'

const NONE_BORDERS: TableBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
  insideHorizontal: { style: BorderStyle.NONE, size: 0 },
  insideVertical: { style: BorderStyle.NONE, size: 0 },
}

export function generateAdminDocument(data: DocxExportData): Document {
  const { metadata, content, noiNhan } = data
  const formattedDate = metadata.ngay_ban_hanh
    ? formatVietnameseDate(metadata.dia_danh || '', metadata.ngay_ban_hanh)
    : ''

  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertMillimetersToTwip(210),
              height: convertMillimetersToTwip(297),
            },
            margin: {
              top: convertMillimetersToTwip(20),
              bottom: convertMillimetersToTwip(20),
              left: convertMillimetersToTwip(30),
              right: convertMillimetersToTwip(15),
            },
          },
        },
        children: [
          createHeaderTable(metadata),
          createSoHieuAndDate(metadata, formattedDate),
          new Paragraph({ spacing: { before: 200 } }),
          createLoaiVanBan(metadata),
          createTrichYeu(metadata),
          new Paragraph({ spacing: { before: 200 } }),
          ...createNoiDung(content),
          new Paragraph({ spacing: { before: 400 } }),
          createFooterTable(metadata, noiNhan),
        ],
      },
    ],
  })
}

function formatVietnameseDate(diaDanh: string, dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const prefix = diaDanh ? `${diaDanh}, ` : ''
  return `${prefix}ngày ${day} tháng ${month} năm ${year}`
}

function createHeaderTable(metadata: DocumentMetadata): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NONE_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: NONE_BORDERS,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (metadata.co_quan_ban_hanh || '').toUpperCase(),
                    bold: true,
                    font: FONT,
                    size: 26,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: NONE_BORDERS,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    bold: true,
                    font: FONT,
                    size: 26,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Độc lập - Tự do - Hạnh phúc',
                    bold: true,
                    font: FONT,
                    size: 28,
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createSoHieuAndDate(metadata: DocumentMetadata, formattedDate: string): Table {
  const soHieuText = metadata.so_hieu ? `Số: ${metadata.so_hieu}` : ''
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NONE_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: NONE_BORDERS,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: soHieuText,
                    font: FONT,
                    size: 26,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: NONE_BORDERS,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100 },
                children: [
                  new TextRun({
                    text: formattedDate,
                    font: FONT,
                    size: 26,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createLoaiVanBan(metadata: DocumentMetadata): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: (metadata.loai_van_ban || '').toUpperCase(),
        bold: true,
        font: FONT,
        size: 28,
      }),
    ],
  })
}

function createTrichYeu(metadata: DocumentMetadata): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: metadata.trich_yeu || '',
        bold: true,
        font: FONT,
        size: 28,
      }),
    ],
  })
}

function createNoiDung(content: string): Paragraph[] {
  return content.split('\n').map(
    (line) =>
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360 },
        indent: { firstLine: convertMillimetersToTwip(12.5) },
        children: [
          new TextRun({
            text: line,
            font: FONT,
            size: 28,
          }),
        ],
      })
  )
}

function createFooterTable(metadata: DocumentMetadata, noiNhan: string[]): Table {
  const noiNhanParagraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Nơi nhận:',
          bold: true,
          italics: true,
          font: FONT,
          size: 22,
        }),
      ],
    }),
    ...noiNhan.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `- ${item};`,
              font: FONT,
              size: 22,
            }),
          ],
        })
    ),
    new Paragraph({
      children: [
        new TextRun({
          text: '- Lưu: VT.',
          font: FONT,
          size: 22,
        }),
      ],
    }),
  ]

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NONE_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: NONE_BORDERS,
            children: noiNhanParagraphs,
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: NONE_BORDERS,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (metadata.loai_van_ban || '').toUpperCase(),
                    bold: true,
                    font: FONT,
                    size: 26,
                  }),
                ],
              }),
              new Paragraph({ spacing: { before: 800 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: metadata.nguoi_ky || '',
                    bold: true,
                    font: FONT,
                    size: 28,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
