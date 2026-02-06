# Solvia Catalog System

Sistem manajemen katalog dan pemesanan reklame digital (Billboard/Videotron) berbasis web. Aplikasi ini memfasilitasi interaksi antara Customer yang ingin menyewa titik reklame dan Admin yang mengelola inventaris serta pesanan.

## 🛠️ Instalasi & Persiapan

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda.

### Prasyarat
- Node.js (Versi 18 atau terbaru disarankan)
- PostgreSQL (Database)
- Git (Opsional)

### Langkah Instalasi

1. **Clone Repository (atau download source code)**
   ```bash
   git clone <repository-url>
   cd catalog
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Buat file `.env` di root project. Pastikan konfigurasi database sesuai dengan local environment Anda. Contoh variabel utama:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/solvia_db?schema=public"
   NEXTAUTH_SECRET="generate_random_secret_here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup Database**
   Lakukan migrasi database menggunakan Prisma untuk membuat tabel yang diperlukan.
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Akses aplikasi di [http://localhost:3000](http://localhost:3000).

---

## 🔄 Alur Penggunaan (Workflow)

Berikut adalah panduan penggunaan sistem berdasarkan peran pengguna.

### 👤 Customer Flow (Penyewa)

1. **Registrasi & Login**
   - Customer membuat akun baru melalui halaman Register.
   - Login untuk mengakses fitur penyewaan.

2. **Eksplorasi Produk**
   - Masuk ke **Dashboard** atau menu **Katalog**.
   - Melihat daftar titik reklame tersedia.
   - Melakukan filter berdasarkan lokasi, harga, atau ketersediaan.

3. **Membuat Pesanan (Booking)**
   - Pilih produk yang diinginkan.
   - Klik tombol **Pesan** atau ikon keranjang/sewa.
   - **Konfigurasi Sewa**:
     - Cek detail produk (Lokasi, Gambar, Spesifikasi).
     - Pilih durasi sewa (Bulanan/Tahunan).
     - Tentukan Tanggal Mulai tayang.
   - Klik **Buat Pesanan**.

4. **Kelola Pesanan**
   - Akses menu **Pesanan Saya**.
   - Melihat status (Pending, Disetujui, Aktif).
   - Mengunduh Invoice/Tagihan.
   - Melakukan pembatalan (jika status masih memungkinkan).

5. **Bantuan**
   - Menggunakan fitur **Chat** untuk menghubungi admin terkait negosiasi atau kendala teknis.

### 🛡️ Admin Flow (Pengelola)

1. **Login Admin**
   - Masuk menggunakan kredensial admin.

2. **Dashboard Monitoring**
   - Melihat ringkasan bisnis: Total Pendapatan, Pesanan Baru, Occupancy Rate.

3. **Manajemen Produk**
   - **Tambah Produk**: Input data billboard baru (Foto, Harga, Lokasi, Dimensi).
   - **Update Stock**: Mengubah status ketersediaan atau harga sewa.

4. **Manajemen Pesanan**
   - Memverifikasi pesanan masuk dari customer.
   - Mengupdate status pesanan (Menyetujui pembayaran, Memulai masa tayang).
   - Melakukan pembatalan paksa jika diperlukan.

5. **Manajemen User**
   - Melihat daftar customer terdaftar.
   - Membalas pesan customer via menu Chat.

---

## 🔧 Teknologi Utama
- **Framework**: Next.js (App Router / Pages Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL & Prisma ORM
- **Icons**: Material Symbols / FontAwesome
