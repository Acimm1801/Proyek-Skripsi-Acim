
// Mengambil elemen form
const form = document.getElementById("mahasiswaForm");

// Mengambil elemen output
const output = document.getElementById("output");

// Menjalankan proses ketika tombol diklik
form.addEventListener("submit", function(event) {

    // Mencegah halaman melakukan reload
    event.preventDefault();

    // =================================
    // 1. INPUT
    // =================================

    const nama = document.getElementById("nama").value.trim();

    const npm = document.getElementById("npm").value.trim();

    const prodi = document.getElementById("prodi").value.trim();


    // =================================
    // 2. PROCESS
    // =================================

    // Memeriksa apakah semua input sudah diisi
    if (nama === "" || npm === "" || prodi === "") {

        alert("Semua data harus diisi!");

        return;
    }


    // =================================
    // 3. OUTPUT
    // =================================

    document.getElementById("hasilNama").textContent = nama;

    document.getElementById("hasilNpm").textContent = npm;

    document.getElementById("hasilProdi").textContent = prodi;

    // Menampilkan bagian output
    output.classList.remove("hidden");

});
