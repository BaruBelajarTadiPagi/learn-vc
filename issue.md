# [Feature] User Registration API with ElysiaJS, Drizzle ORM, and Password Hashing

## 📌 Objective
Mengimplementasikan fitur registrasi user baru (`POST /api/users`) lengkap dengan hashing password menggunakan `bcrypt`, validasi data, serta penataan arsitektur modular (`routes` & `services`) di dalam folder `src/`. Dokumen ini ditujukan sebagai panduan kerja langkah demi langkah untuk programmer atau AI coding model.

---

## 🛠 Spesifikasi Teknis

### 1. Database Schema (`users` table)
Tabel `users` pada MySQL harus memiliki kolom berikut:
- `id`: Integer, Primary Key, Auto Increment
- `name`: VARCHAR(255), Not Null
- `email`: VARCHAR(255), Not Null, Unique
- `password`: VARCHAR(255), Not Null (Menyimpan hash password dari `bcrypt` / `Bun.password`)
- `created_at`: TIMESTAMP, Not Null, Default `CURRENT_TIMESTAMP`

### 2. API Contract
- **Endpoint**: `POST /api/users`
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Eko",
    "email": "eko@gmail.com",
    "password": "rahasia"
  }
  ```
- **Response Success (HTTP 201 / 200)**:
  ```json
  {
    "data": "OK"
  }
  ```
- **Response Error - Email Duplikat (HTTP 400 / 409)**:
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```

---

## 📁 Struktur Folder & File (`src/`)

Susun struktur project di bawah direktori `src/` dengan pola modular berikut:

```
src/
├── db/
│   ├── index.ts          # Database pool connection
│   └── schema.ts         # Definisi schema tabel Drizzle
├── services/
│   └── user-service.ts   # Logic bisnis (cek email, hash password, insert database)
├── routes/
│   └── users-routes.ts   # Routing ElysiaJS & validasi request body
└── index.ts              # Entry point Elysia server (mount router)
```

> **Aturan Penamaan File:**
> - File routing berada di folder `src/routes/` dengan format `users-routes.ts`
> - File service berada di folder `src/services/` dengan format `user-service.ts`

---

## 📋 Tahapan Implementasi (Step-by-Step)

### Langkah 1: Update Schema Drizzle (`src/db/schema.ts`)
1. Buka file `src/db/schema.ts`.
2. Perbarui atau definisikan tabel `users` dengan kolom:
   - `id`: `serial("id").primaryKey()` atau `int("id").autoincrement().primaryKey()`
   - `name`: `varchar("name", { length: 255 }).notNull()`
   - `email`: `varchar("email", { length: 255 }).notNull().unique()`
   - `password`: `varchar("password", { length: 255 }).notNull()`
   - `createdAt`: `timestamp("created_at").defaultNow().notNull()`
3. Jalankan `bun run db:generate` dan `bun run db:push` untuk menyinkronkan perubahan ke database MySQL.

### Langkah 2: Buat User Service (`src/services/user-service.ts`)
1. Buat folder `src/services/` jika belum ada, lalu buat file `user-service.ts`.
2. Buat fungsi registrasi (misal: `registerUser({ name, email, password })`).
3. Di dalam fungsi:
   - Cek apakah `email` sudah ada di database menggunakan Drizzle query `db.select().from(users).where(eq(users.email, email))`.
   - Jika email sudah terdaftar, lempar error atau kembalikan response error: `"Email sudah terdaftar"`.
   - Hash `password` menggunakan `await Bun.password.hash(password, { algorithm: "bcrypt" })` (atau library `bcryptjs`/`bcrypt`).
   - Simpan user baru ke database (`db.insert(users).values(...)`).
   - Kembalikan status sukses.

### Langkah 3: Buat Route Registrasi (`src/routes/users-routes.ts`)
1. Buat folder `src/routes/` jika belum ada, lalu buat file `users-routes.ts`.
2. Buat instance router Elysia baru:
   - Definisikan endpoint `POST /api/users` (atau route `/` jika di-prefix dengan `/api/users`).
   - Gunakan schema validation Elysia `t.Object({ name: t.String(), email: t.String({ format: "email" }), password: t.String() })`.
   - Panggil service `registerUser` dari `src/services/user-service.ts`.
   - Jika sukses, set response `{ "data": "OK" }`.
   - Jika email sudah terdaftar atau gagal, tangkap error dan set response format `{ "error": "Email sudah terdaftar" }` dengan HTTP status yang sesuai.

### Langkah 4: Hubungkan Route ke Entry Point (`src/index.ts`)
1. Buka file `src/index.ts`.
2. Import router dari `src/routes/users-routes.ts`.
3. Pasang (mount) router menggunakan `.use(usersRoutes)` pada instance utama Elysia app.

### Langkah 5: Pengujian & Verifikasi
1. Jalankan server dengan `bun run dev`.
2. Lakukan request `POST /api/users` dengan data baru:
   - Pastikan response mengembalikan `{"data": "OK"}`.
   - Periksa database MySQL untuk memastikan password tersimpan dalam bentuk hash (bukan plaintext).
3. Lakukan request `POST /api/users` kembali dengan email yang sama:
   - Pastikan response mengembalikan `{"error": "Email sudah terdaftar"}`.

---

## 🎯 Acceptance Criteria
- [ ] Schema `users` memiliki kolom `id`, `name`, `email`, `password`, dan `created_at`.
- [ ] Folder `src/routes/` dan `src/services/` dibuat sesuai aturan penamaan file (`users-routes.ts` & `user-service.ts`).
- [ ] Endpoint `POST /api/users` menerima request body `name`, `email`, `password`.
- [ ] Password di-hash menggunakan algoritma `bcrypt` sebelum disimpan ke database.
- [ ] Mengembalikan `{ "data": "OK" }` jika pendaftaran berhasil.
- [ ] Mengembalikan `{ "error": "Email sudah terdaftar" }` jika email sudah ada di database.
