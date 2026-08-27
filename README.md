# Belajar Vibe Coding - Backend Service

Backend service modern yang dibangun menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan database **MySQL**.

---

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) & `drizzle-kit`
- **Database Driver**: `mysql2` (MySQL)

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat
- [Bun](https://bun.sh/) terinstal di sistem Anda (`bun --version`).
- Database MySQL aktif (contoh: via Laragon, XAMPP, atau Docker).

### 2. Konfigurasi Environment
Salin template konfigurasi:
```bash
cp .env.example .env
```
Sesuaikan kredensial koneksi database MySQL Anda di dalam file `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=learn_vc
```

### 3. Migrasi Database
Untuk menerapkan schema database ke MySQL:
```bash
# Generate file migrasi SQL
bun run db:generate

# Push schema langsung ke MySQL
bun run db:push

# Buka visual interface Drizzle Studio
bun run db:studio
```

### 4. Menjalankan Server
```bash
# Mode Development (Hot reload)
bun run dev

# Mode Production
bun run start
```

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/` | Base welcome endpoint & status service |
| `GET` | `/health` | Healthcheck & server uptime |
| `GET` | `/api/users` | Mengambil daftar semua user dari database MySQL |
| `POST` | `/api/users` | Menambahkan user baru `{ "name": "...", "email": "..." }` |
