

const form = document.getElementById("mahasiswaForm");


const output = document.getElementById("output");


form.addEventListener("submit", function(event) {


    event.preventDefault();

    // 1. INPUT

    const nama = document.getElementById("nama").value.trim();

    const npm = document.getElementById("npm").value.trim();

    const prodi = document.getElementById("prodi").value.trim();


    // 2. PROCESS

    if (nama === "" || npm === "" || prodi === "") {

        alert("Semua data harus diisi!");

        return;
    }

    // 3. OUTPUT

    document.getElementById("hasilNama").textContent = nama;

    document.getElementById("hasilNpm").textContent = npm;

    document.getElementById("hasilProdi").textContent = prodi;


    output.classList.remove("hidden");

});
