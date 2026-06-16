Kamu adalah senior Web3 engineer yang ahli di Solidity dan best practice security (OpenZeppelin, checks-effects-interactions, reentrancy guard).

Tugas: buat smart contract Solidity untuk game mini bernama Reflexia, yang membagikan reward dalam USDm di jaringan Celo. Game logic (skor, anti-cheat, dsb) berjalan off-chain, dan smart contract ini HANYA mengurus claim reward yang sudah divalidasi backend.

Spesifikasi:

Network & Token

Kontrak akan di-deploy di jaringan Celo.

Reward menggunakan token ERC-20 (USDm) dengan interface standar (IERC20).

Address token diset di constructor dan bisa di-update hanya oleh owner (dengan event).

Model claim reward (voucher + signature)

Backend akan menghasilkan voucher berisi:

recipient (address pemain)

amount (uint256, jumlah USDm)

nonce unik per claim

optional: expiresAt (timestamp)

Voucher ditandatangani oleh signer address khusus (game backend) menggunakan EIP-191 / EIP-712 (boleh pilih salah satu, jelaskan di komentar).

Kontrak harus punya fungsi:
function claim(address recipient, uint256 amount, uint256 nonce, uint256 expiresAt, bytes calldata signature) external

Kontrak memverifikasi:

signature valid dan ditandatangani oleh signer yang sudah diset owner,

nonce belum pernah dipakai (anti double claim),

expiresAt belum lewat (kalau 0, artinya tidak pakai expiry),

optional: recipient == msg.sender untuk mencegah front-running.

Anti-abuse & safety

Simpan mapping usedNonces[nonce] = true setelah claim sukses.

Tambahkan limit harian:

maxDailyPayoutPerUser (configurable oleh owner),

tracking claimedToday[user][dayIndex] di mana dayIndex = block.timestamp / 1 days.

Kalau total klaim user di hari itu melebihi limit, transaksi revert.

Tambahkan maxTotalPayout untuk pool global, dan stop payout kalau sudah terlampaui.

Gunakan OpenZeppelin ReentrancyGuard dan Ownable.

Admin functions

setSigner(address newSigner) hanya oleh owner.

setToken(address newToken) hanya oleh owner.

setMaxDailyPayoutPerUser(uint256 newLimit) hanya oleh owner.

setMaxTotalPayout(uint256 newMax) hanya oleh owner.

withdrawToken(address to, uint256 amount) untuk menarik sisa USDm dari contract.

Events

event RewardClaimed(address indexed recipient, uint256 amount, uint256 indexed nonce, uint256 dayIndex);

Event lain untuk perubahan konfigurasi (signer, token, limits).

Security & style

Gunakan Solidity versi terbaru yang stabil (misalnya ^0.8.20).

Import library OpenZeppelin (IERC20, Ownable, ReentrancyGuard, ECDSA).

Sertakan komentar singkat di bagian yang penting (bukan komentar berlebihan).

Pastikan urutan operasi mengikuti pola checks-effects-interactions.

Output

Berikan satu file contract utama bernama ReflexiaRewardDistributor.sol.

Jelaskan secara singkat (dalam komentar di atas kontrak) bagaimana backend harus membentuk message untuk signature dan bagaimana memverifikasi di frontend.

Fokuskan pada: sederhana, aman, mudah diintegrasikan oleh frontend React/Next.js + backend Node.js. Jangan implementasi game logic di smart contract; hanya reward payout.