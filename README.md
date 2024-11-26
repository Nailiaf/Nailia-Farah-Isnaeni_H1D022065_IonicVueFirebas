![Halaman Login](vueawal.png)
![Halaman Home](vuehome.png)
![Halaman Profile](vueprofile.png)

Penjelasan Alur Kerja Aplikasi Ionic dengan Firebase Authentication menggunakan Google Login

1. Inisialisasi Firebase
   File `src/utils/firebase.ts` digunakan untuk menginisialisasi Firebase dengan konfigurasi proyek yang meliputi `apiKey`, `authDomain`, dan lainnya. Firebase diatur untuk menyediakan layanan autentikasi dan Google sebagai penyedia login:
   ```typescript
   const firebase = initializeApp(firebaseConfig);
   const auth = getAuth(firebase);
   const googleProvider = new GoogleAuthProvider();
   ```

2. State Management Menggunakan Pinia
   Store `auth` dibuat di `src/stores/auth.ts` menggunakan Pinia untuk menyimpan dan mengelola data user. Store ini memiliki:
   - Variabel `user` untuk menyimpan informasi user yang sedang login.
   - Fungsi `loginWithGoogle` untuk proses autentikasi login Google.
   - Fungsi `logout` untuk keluar dari akun.

3. Proses Login dengan Google
   - Fungsi `loginWithGoogle` menggunakan plugin Capacitor `@codetrix-studio/capacitor-google-auth` untuk mendapatkan token Google.
   - Setelah token berhasil diambil, token ini dikonversi menjadi kredensial Firebase menggunakan:
     ```typescript
     const credential = GoogleAuthProvider.credential(idToken);
     const result = await signInWithCredential(auth, credential);
     ```
   - Informasi pengguna seperti nama dan email diakses dari `result.user`.

4. Pengecekan State Login
   - Firebase menggunakan `onAuthStateChanged` untuk mendeteksi perubahan status autentikasi pengguna. Jika pengguna login atau logout, state `user` diperbarui secara otomatis:
     ```typescript
     onAuthStateChanged(auth, (currentUser) => {
         user.value = currentUser;
     });
     ```

5. Routing dan Middleware Autentikasi
   - Aplikasi menggunakan meta property di route untuk membedakan halaman yang membutuhkan autentikasi (`isAuth: true`) atau tidak (`isAuth: false`).
   - Sebelum setiap transisi halaman, middleware memeriksa apakah pengguna sudah login atau belum. Jika belum login, pengguna diarahkan ke halaman `/login`.

6. Komponen Login Page
   - Tombol login pada `loginpage.vue` memanggil fungsi `loginWithGoogle` dari store:
     ```html
     <ion-button @click="login" color="light">
         <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
         <ion-label>Sign In with Google</ion-label>
     </ion-button>
     ```
   - Setelah login sukses, pengguna diarahkan ke halaman `/home`.

7. Komponen Profile Page
   - Halaman profil di `profilpage.vue` menampilkan data pengguna yang telah login seperti nama (`user?.displayName`) dan email (`user?.email`):
     ```html
     <ion-input label="Nama" :value="user?.displayName" :readonly="true"></ion-input>
     <ion-input label="Email" :value="user?.email" :readonly="true"></ion-input>
     ```
   - Gambar profil diambil dari `user.photoURL` dan ditampilkan dalam elemen avatar.

8. Logout  
   - Tombol logout memanggil fungsi `logout` untuk keluar dari akun Firebase dan Google. Setelah itu, pengguna diarahkan kembali ke halaman `/login`.

CRUD

Penjelasan Kode

1. Struktur Firebase dan Firestore
`src/utils/firebase.ts`:  
  File ini mengatur koneksi ke Firestore dengan fungsi `getFirestore`. Variabel `db` adalah instance Firestore yang digunakan untuk operasi database.
  
  ```typescript
  const db = getFirestore(firebase);
  export { auth, googleProvider, db };
  ```

2. Model dan Layanan Firestore
- Interface `Todo`:
  Ini adalah struktur data untuk `todo` yang mencakup atribut `id`, `title`, `description`, `status`, `createdAt`, dan `updatedAt`.
  
  ```typescript
  export interface Todo {
      id?: string;
      title: string;
      description: string;
      status: boolean;
      createdAt: Timestamp;
      updatedAt: Timestamp;
  }
  ```

- `firestoreService`:
  Layanan ini menyediakan metode CRUD:
  - `addTodo`: Menambahkan data todo baru.
  - `getTodos`: Mendapatkan semua data todo dengan pengurutan berdasarkan waktu pembaruan.
  - `updateTodo`: Memperbarui data todo berdasarkan `id`.
  - `deleteTodo`: Menghapus data todo berdasarkan `id`.
  - `updateStatus`: Mengubah status todo menjadi aktif atau selesai.

---

3. Modifikasi Komponen dan Halaman

a. Modifikasi `src/App.vue`
- Menambahkan `TabsMenu` pada setiap halaman kecuali `LoginPage` menggunakan computed property `showTabs`.

b. Modifikasi `src/views/HomePage.vue`
- Komponen Ion:
  - Menggunakan berbagai komponen seperti `IonCard`, `IonItemSliding`, dan `IonFab` untuk desain halaman.
  - Menambahkan fungsionalitas seperti swipe refresh dan tombol tambah (`add`).

- Logika Data:
  - Reactive Data:
    Variabel seperti `todos`, `isOpen`, dan `editingId` dideklarasikan dengan `ref` untuk mengelola status aplikasi.
  - Fungsi:
    - `loadTodos`: Memuat daftar todos dari Firestore.
    - `handleRefresh`: Menangani pembaruan data saat halaman di-refresh.
    - `handleSubmit`: Menangani penambahan atau pengeditan data todo.
    - `handleDelete`: Menghapus todo yang dipilih.
    - `handleStatus`: Mengubah status todo menjadi selesai atau aktif.

---

4. Komponen `InputModal`
Komponen ini digunakan untuk menampilkan modal input form, baik untuk menambahkan atau mengedit `todo`. 

- Props dan Emit:
  - Props: `isOpen`, `editingId`, dan data `todo`.
  - Emit: Mengirimkan event `submit` ketika form selesai diisi.

---

5. Fungsi Tambahan
- Toast Notification (`showToast`):
  Menampilkan notifikasi singkat untuk memberikan umpan balik kepada pengguna, misalnya setelah data berhasil ditambahkan atau dihapus.

- Waktu Relatif (`getRelativeTime`):
  Menghitung dan menampilkan waktu relatif (misalnya, "2 minutes ago").

- Item Sliding:
  Menggunakan `ion-item-sliding` untuk memberikan opsi swipe pada setiap todo:
  - Swipe kiri untuk menghapus.
  - Swipe kanan untuk mengubah status atau mengedit.

---

6. Gaya Halaman
- Menambahkan scrollable container untuk menampilkan daftar `todo` dengan scrollbar yang dapat dikustomisasi.

---

7. Keseluruhan Alur
1. Pengguna Login → Menjalankan Firebase Auth.
2. Halaman `HomePage`:
   - Load Data: Data `todo` dimuat dari Firestore.
   - Tambah/Edit: Membuka modal input untuk menambah atau mengedit data.
   - Hapus/Update: Menghapus data atau mengubah status menggunakan opsi swipe.
3. Penyimpanan Data: Semua operasi disimpan langsung di Firestore.

---
