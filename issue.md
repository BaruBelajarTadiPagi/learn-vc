# [Feature] User Login API and Session Management

## 📌 Objective
Mengimplementasikan fitur login user dan manajemen sesi (session). Fitur ini akan memvalidasi kredensial user, membuat session token berupa UUID, dan menyimpannya ke database. Dokumen ini ditujukan sebagai panduan kerja langkah demi langkah untuk programmer atau AI coding model.

---

## 🛠 Spesifikasi Teknis

### 1. Database Schema (`sessions` table)
Buat tabel `sessions` pada MySQL dengan spesifikasi berikut:
- `id`: Integer, Primary Key, Auto Increment
- `token`: VARCHAR(255), Not Null (Akan diisi dengan UUID untuk token sesi user)
- `user_id`: Integer, Not Null (Foreign Key yang mengarah ke tabel `users`)
- `created_at`: TIMESTAMP, Not Null, Default `CURRENT_TIMESTAMP`

### 2. API Contract
- **Endpoint**: `POST /api/users/login` *(Catatan: Disarankan menggunakan path `/login` agar tidak bentrok dengan endpoint registrasi `POST /api/users`)*
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "eko@gmail.com",
    "password": "rahasia"
  }
  ```
  *(Catatan: Field `name` opsional untuk login, yang utama adalah `email` dan `password`)*
- **Response Success (HTTP 200)**:
  ```json
  {
    "data": "token-uuid-disini"
  }
  ```
- **Response Error (HTTP 401)**:
  ```json
  {
    "error": "email atau password salah"
  }
  ```

---

## 📁 Struktur Folder & File (`src/`)

Gunakan struktur folder dan penamaan file modular berikut:
- **Routes** (`src/routes/`): Tambahkan endpoint login ke file `users-routes.ts` (atau buat file baru `sessions-routes.ts`).
- **Services** (`src/services/`): Tambahkan logic login ke file `user-service.ts`.

---

## 📋 Tahapan Implementasi (Step-by-Step)

### Langkah 1: Buat Schema Tabel Sessions (`src/db/schema.ts`)
1. Buka file `src/db/schema.ts`.
2. Definisikan tabel baru `sessions`:
   - Gunakan `mysqlTable` dari `drizzle-orm/mysql-core`.
   - Tambahkan kolom `id` (`serial`), `token` (`varchar(255)`), `userId` (`int` dengan foreign key reference ke `users.id`), dan `createdAt` (`timestamp`).
3. Tambahkan relasi jika diperlukan (opsional).
4. Jalankan perintah `bun run db:generate` untuk membuat file migrasi SQL.
5. Jalankan perintah `bun run db:push` atau `bun run db:migrate` untuk mengaplikasikan tabel baru ke database MySQL.

### Langkah 2: Tambahkan Logic Login di Service (`src/services/user-service.ts`)
1. Buka file `src/services/user-service.ts`.
2. Buat fungsi baru, misalnya `login(email, password)`.
3. Di dalam fungsi `login`:
   - Cari user di database berdasarkan `email` menggunakan query Drizzle.
   - Jika user tidak ditemukan, lemparkan error (throw error) `"email atau password salah"`.
   - Jika user ditemukan, verifikasi password menggunakan `Bun.password.verify(password, hashedPasswordFromDB)`.
   - Jika password tidak cocok, lemparkan error `"email atau password salah"`.
   - Jika kredensial valid, buat UUID baru untuk token sesi (bisa menggunakan `crypto.randomUUID()`).
   - Simpan token tersebut beserta `user_id` ke tabel `sessions` menggunakan query `db.insert(sessions)`.
   - Kembalikan token tersebut (misal: `{ data: "uuid-token" }`).

### Langkah 3: Buat Endpoint Login di Routes (`src/routes/users-routes.ts`)
1. Buka file `src/routes/users-routes.ts`.
2. Tambahkan endpoint baru `.post("/login", ...)` ke dalam router.
3. Gunakan validasi schema Elysia (`t.Object`) untuk memastikan request body memiliki `email` dan `password`.
4. Panggil fungsi `UserService.login(...)`.
5. Jika sukses, kembalikan response dengan status 200 dan body `{ data: "token" }`.
6. Jika terjadi error (ditangkap oleh blok `catch`), cek apakah error message-nya adalah `"email atau password salah"`. Jika ya, kembalikan status 401 Unauthorized dengan body `{ error: "email atau password salah" }`.

### Langkah 4: Pengujian & Verifikasi
1. Pastikan server berjalan dengan `bun run dev`.
2. Lakukan request POST ke endpoint login menggunakan kredensial yang salah. Pastikan menerima error `401`.
3. Lakukan request POST dengan kredensial yang benar. Pastikan menerima response sukses berisi token UUID.
4. Cek database MySQL (tabel `sessions`) untuk memastikan record sesi berhasil terbuat.

---

## 🎯 Acceptance Criteria
- [ ] Tabel `sessions` berhasil dibuat di database dengan foreign key ke tabel `users`.
- [ ] Fungsi login memvalidasi kecocokan password menggunakan hashing (misal: bcrypt).
- [ ] Token sesi (UUID) di-generate secara unik untuk setiap login yang berhasil dan tersimpan di database.
- [ ] Endpoint mengembalikan response error yang seragam (`"email atau password salah"`) baik saat email tidak ditemukan maupun saat password salah, untuk alasan keamanan.
- [ ] Struktur kode tetap mengikuti pattern modular di `routes` dan `services`.
