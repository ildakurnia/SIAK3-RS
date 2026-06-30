import { HospitalUnit, Category } from '../types';

export const INITIAL_HOSPITAL_UNITS: HospitalUnit[] = [
  { id: 1, name: 'IGD' },
  { id: 2, name: 'ICU' },
  { id: 3, name: 'Rawat Inap' },
  { id: 4, name: 'Rawat Jalan' },
  { id: 5, name: 'Kamar Operasi' },
  { id: 6, name: 'Laboratorium' },
  { id: 7, name: 'Radiologi' },
  { id: 8, name: 'Farmasi' },
  { id: 9, name: 'CSSD' },
  { id: 10, name: 'Laundry' },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-a',
    name: 'Administrasi K3',
    isDefault: true,
    items: [
      { id: 'item-a1', categoryId: 'cat-a', categoryName: 'Administrasi K3', description: 'Program K3 Rumah Sakit tersedia', isDefault: true },
      { id: 'item-a2', categoryId: 'cat-a', categoryName: 'Administrasi K3', description: 'SOP K3 tersedia', isDefault: true },
      { id: 'item-a3', categoryId: 'cat-a', categoryName: 'Administrasi K3', description: 'Rambu-rambu K3 terpasang', isDefault: true },
      { id: 'item-a4', categoryId: 'cat-a', categoryName: 'Administrasi K3', description: 'Jalur evakuasi memiliki penunjuk arah', isDefault: true },
    ],
  },
  {
    id: 'cat-b',
    name: 'Alat Pelindung Diri (APD)',
    isDefault: true,
    items: [
      { id: 'item-b1', categoryId: 'cat-b', categoryName: 'Alat Pelindung Diri (APD)', description: 'APD tersedia sesuai kebutuhan', isDefault: true },
      { id: 'item-b2', categoryId: 'cat-b', categoryName: 'Alat Pelindung Diri (APD)', description: 'APD digunakan oleh petugas', isDefault: true },
      { id: 'item-b3', categoryId: 'cat-b', categoryName: 'Alat Pelindung Diri (APD)', description: 'APD dalam kondisi baik', isDefault: true },
      { id: 'item-b4', categoryId: 'cat-b', categoryName: 'Alat Pelindung Diri (APD)', description: 'Petugas memahami penggunaan APD', isDefault: true },
    ],
  },
  {
    id: 'cat-c',
    name: 'Pencegahan Kebakaran',
    isDefault: true,
    items: [
      { id: 'item-c1', categoryId: 'cat-c', categoryName: 'Pencegahan Kebakaran', description: 'APAR tersedia', isDefault: true },
      { id: 'item-c2', categoryId: 'cat-c', categoryName: 'Pencegahan Kebakaran', description: 'APAR masih berlaku', isDefault: true },
      { id: 'item-c3', categoryId: 'cat-c', categoryName: 'Pencegahan Kebakaran', description: 'Hydrant berfungsi', isDefault: true },
      { id: 'item-c4', categoryId: 'cat-c', categoryName: 'Pencegahan Kebakaran', description: 'Jalur evakuasi bebas hambatan', isDefault: true },
      { id: 'item-c5', categoryId: 'cat-c', categoryName: 'Pencegahan Kebakaran', description: 'Emergency Exit dapat digunakan', isDefault: true },
    ],
  },
  {
    id: 'cat-d',
    name: 'Keselamatan Listrik',
    isDefault: true,
    items: [
      { id: 'item-d1', categoryId: 'cat-d', categoryName: 'Keselamatan Listrik', description: 'Kabel listrik tidak rusak', isDefault: true },
      { id: 'item-d2', categoryId: 'cat-d', categoryName: 'Keselamatan Listrik', description: 'Stop kontak aman', isDefault: true },
      { id: 'item-d3', categoryId: 'cat-d', categoryName: 'Keselamatan Listrik', description: 'Panel listrik tertutup', isDefault: true },
      { id: 'item-d4', categoryId: 'cat-d', categoryName: 'Keselamatan Listrik', description: 'Grounding berfungsi', isDefault: true },
    ],
  },
  {
    id: 'cat-e',
    name: 'Pengelolaan Limbah Medis',
    isDefault: true,
    items: [
      { id: 'item-e1', categoryId: 'cat-e', categoryName: 'Pengelolaan Limbah Medis', description: 'Tempat limbah infeksius tersedia', isDefault: true },
      { id: 'item-e2', categoryId: 'cat-e', categoryName: 'Pengelolaan Limbah Medis', description: 'Safety box tersedia', isDefault: true },
      { id: 'item-e3', categoryId: 'cat-e', categoryName: 'Pengelolaan Limbah Medis', description: 'Pemilahan limbah sesuai', isDefault: true },
      { id: 'item-e4', categoryId: 'cat-e', categoryName: 'Pengelolaan Limbah Medis', description: 'Tempat sampah tertutup', isDefault: true },
    ],
  },
  {
    id: 'cat-f',
    name: 'Bahan Berbahaya dan Beracun (B3)',
    isDefault: true,
    items: [
      { id: 'item-f1', categoryId: 'cat-f', categoryName: 'Bahan Berbahaya dan Beracun (B3)', description: 'MSDS tersedia', isDefault: true },
      { id: 'item-f2', categoryId: 'cat-f', categoryName: 'Bahan Berbahaya dan Beracun (B3)', description: 'Label bahan kimia lengkap', isDefault: true },
      { id: 'item-f3', categoryId: 'cat-f', categoryName: 'Bahan Berbahaya dan Beracun (B3)', description: 'Penyimpanan sesuai standar', isDefault: true },
      { id: 'item-f4', categoryId: 'cat-f', categoryName: 'Bahan Berbahaya dan Beracun (B3)', description: 'Ventilasi penyimpanan baik', isDefault: true },
    ],
  },
  {
    id: 'cat-g',
    name: 'Pencegahan dan Pengendalian Infeksi (PPI)',
    isDefault: true,
    items: [
      { id: 'item-g1', categoryId: 'cat-g', categoryName: 'Pencegahan dan Pengendalian Infeksi (PPI)', description: 'Hand sanitizer tersedia', isDefault: true },
      { id: 'item-g2', categoryId: 'cat-g', categoryName: 'Pencegahan dan Pengendalian Infeksi (PPI)', description: 'Fasilitas cuci tangan berfungsi', isDefault: true },
      { id: 'item-g3', categoryId: 'cat-g', categoryName: 'Pencegahan dan Pengendalian Infeksi (PPI)', description: 'Masker digunakan sesuai prosedur', isDefault: true },
      { id: 'item-g4', categoryId: 'cat-g', categoryName: 'Pencegahan dan Pengendalian Infeksi (PPI)', description: 'Peralatan medis disterilkan', isDefault: true },
    ],
  },
  {
    id: 'cat-h',
    name: 'Ergonomi',
    isDefault: true,
    items: [
      { id: 'item-h1', categoryId: 'cat-h', categoryName: 'Ergonomi', description: 'Posisi kerja ergonomis', isDefault: true },
      { id: 'item-h2', categoryId: 'cat-h', categoryName: 'Ergonomi', description: 'Alat bantu angkat tersedia', isDefault: true },
      { id: 'item-h3', categoryId: 'cat-h', categoryName: 'Ergonomi', description: 'Barang disusun dengan aman', isDefault: true },
    ],
  },
];
