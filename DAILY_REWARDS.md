Kamu adalah product designer + product manager + game UX writer.

Tugasmu: update PRD game mini “Reflexia” menjadi versi terbaru yang lebih realistis untuk MVP hackathon di MiniPay / Celo.

Konteks project:

Reflexia adalah mini game casual bertema cute kids dengan gameplay refleks cepat.

Game ini adalah MiniApp untuk MiniPay di ekosistem Celo.

Reward on-chain utama menggunakan USDm, bukan USDT.

User bisa swap USDm ke token lain melalui MiniPay Pockets.

Fokus MVP: simple, fun, mobile-first, lightweight, cepat dibangun.

Perubahan penting yang wajib diterapkan

Hapus / hide fitur leaderboard global karena MVP tidak ingin bergantung pada backend ranking.

Ganti fitur tersebut dengan Daily Rewards sebagai fitur retention utama.

Daily Rewards menggunakan 7-day reward cycle:

Day 1: 0.0001 USDm + 1 star

Day 2: 0.0002 USDm + 2 stars

Day 3: 0.0003 USDm + 3 stars

Day 4: 0.0005 USDm + 4 stars

Day 5: 0.0007 USDm + 5 stars

Day 6: 0.0010 USDm + 7 stars

Day 7: 0.0020 USDm + 10 stars + bonus chest

Setelah Day 7, reward cycle reset kembali ke Day 1.

Stars adalah soft progression currency untuk unlock cosmetic item / cute accessories, bukan untuk ditukar ke USDm.

Daily Rewards harus punya UI yang cute, playful, simple, dan cocok untuk mobile casual game.

Hindari sistem yang membutuhkan backend kompleks; desain fitur agar tetap masuk akal untuk MVP.

Output yang diminta

Buat PRD yang rapi dan praktis dengan struktur berikut:

Product Overview

Jelaskan game Reflexia secara singkat.

Jelaskan positioning sebagai cute casual reflex game untuk MiniPay users.

Goals

Tujuan gameplay.

Tujuan retention.

Tujuan Web3 / MiniPay integration.

Target Users

Casual mobile users.

MiniPay users.

Hackathon MVP audience.

Core Gameplay

Jelaskan loop utama game refleks.

Ronde singkat, tap cepat, skor, feedback instan.

Reward System

Jelaskan bahwa reward on-chain utama adalah USDm.

Jelaskan bahwa stars adalah off-chain progression currency untuk cosmetic unlock.

Jelaskan alasan memakai kombinasi USDm + stars.

Daily Rewards Feature

Jelaskan bahwa fitur ini menggantikan leaderboard global.

Jelaskan 7-day cycle dengan tabel reward lengkap.

Jelaskan bahwa setelah Day 7, cycle reset ke Day 1.

Jelaskan bahwa bonus chest ada di Day 7.

Jelaskan aturan sederhana, misalnya 1 claim per hari.

UX / UI Changes

Tambahkan tombol/menu Daily Rewards di home screen.

Hapus leaderboard button.

Buat halaman Daily Rewards yang menampilkan progress hari ini, reward yang sudah diklaim, reward berikutnya, dan call-to-action claim.

UI harus bertema cute kids: pastel, rounded, playful, friendly.

Feature Scope

Pisahkan fitur MVP vs non-MVP.

MVP harus fokus pada gameplay sederhana, daily rewards, wallet connection, dan reward claim flow.

Non-MVP: leaderboard global, social competition, friend invites, dan analytics kompleks.

Smart Contract Role

Jelaskan bahwa smart contract hanya mengurus claim reward USDm yang telah divalidasi, bukan gameplay.

Jelaskan bahwa stars/cosmetics tetap off-chain di MVP.

Acceptance Criteria

User bisa paham daily rewards dalam beberapa detik.

Day 7 reward terasa lebih spesial.

Tidak ada ketergantungan leaderboard backend.

Reward loop terasa menarik untuk dimainkan ulang.

UX Copy Suggestions

Berikan contoh microcopy untuk tombol dan label seperti:

Daily Rewards

Claim Today

Come back tomorrow

Day 7 Bonus

10 Stars earned

Gaya penulisan

Tulis dalam bahasa Inggris yang jelas dan siap dipakai untuk dokumen produk / handoff ke designer/developer.

Ringkas tapi detail.

Fokus ke implementasi MVP.

Jangan terlalu enterprise / formal kaku.

Gunakan bullet points dan tabel jika perlu.

Catatan penting

Jangan masukkan leaderboard sebagai core feature.

Jangan gunakan USDT sebagai reward utama in-app; gunakan USDm.

Jangan menambah backend-heavy features.

Pastikan PRD konsisten dengan konsep game cute kids + Web3 MiniPay + simple reflex gameplay.