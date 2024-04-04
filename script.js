
let notesData = [];

async function createNoteAPI(title, body) {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, body })
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Note created successfully:", data);
      return data.data;
    } else {
      console.error("Failed to create note:", data);
      return null;
    }
  } catch (error) {
    console.error("Error creating note:", error);
    return null;
  }
}

// Membuat event listener untuk tombol "Create Note"
const createButton = document.getElementById('create-button');
createButton.addEventListener('click', async function() {
  const title = prompt('Enter note title:');
  const body = prompt('Enter note body:');

  if (title !== null && body !== null) {
    const newNote = await createNoteAPI(title, body);
    if (newNote) {
      notesData.push(newNote);
      displayNotes(notesData);
    }
  }
});

// Fungsi untuk mendapatkan catatan dari API
async function fetchNotes() {
  try {
    // Menampilkan indikator loading sebelum memulai permintaan
    showLoadingIndicator();

    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    const data = await response.json();
    notesData = data.data;
    renderNoteList();

    // Menyembunyikan indikator loading setelah permintaan selesai
    hideLoadingIndicator();
  } catch (error) {
    console.error("Error fetching notes:", error);
    hideLoadingIndicator();
  }
}

async function getNotesAPI() {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes`, {
      method: "GET"
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Notes retrieved successfully:", data);
      return data.data;
    } else {
      console.error("Failed to retrieve notes:", data);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return [];
  }
}

async function archiveNoteAPI(noteId) {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/archive`, {
      method: "POST"
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Note archived successfully:", data);
      return true;
    } else {
      console.error("Failed to archive note:", data);
      return false;
    }
  } catch (error) {
    console.error("Error archiving note:", error);
    return false;
  }
}


// Mendapatkan elemen tombol "Archive Note" berdasarkan class atau id
const archiveButton = document.getElementById('archive-button'); // Gantikan 'archive-button' dengan id tombol yang sesuai

// Menambahkan event listener untuk tombol "Archive Note"
archiveButton.addEventListener('click', async function() {
  // Mendapatkan ID catatan yang akan diarsipkan dari atribut data di elemen catatan
  const noteId = this.closest('.note').dataset.id;

  // Meminta konfirmasi dari pengguna sebelum melakukan arsip catatan
  const archiveConfirmed = confirm("Are you sure you want to archive this note?");

  // Jika pengguna mengonfirmasi untuk mengarsipkan catatan
  if (archiveConfirmed) {
    // Memanggil fungsi archiveNoteAPI untuk mengarsipkan catatan dengan ID yang sesuai
    const isArchived = await archiveNoteAPI(noteId);

    // Jika catatan berhasil diarsipkan, hapus elemen catatan dari tampilan
    if (isArchived) {
      this.closest('.note').remove();
    }
  }
});



async function unarchiveNoteAPI(noteId) {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/unarchive`, {
      method: "POST"
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Note unarchived successfully:", data);
      return true;
    } else {
      console.error("Failed to unarchive note:", data);
      return false;
    }
  } catch (error) {
    console.error("Error unarchiving note:", error);
    return false;
  }
}

// Mendapatkan elemen tombol "Unarchive Note" berdasarkan class atau id
const unarchiveButton = document.getElementById('unarchive-button'); // Gantikan 'unarchive-button' dengan id tombol yang sesuai

// Menambahkan event listener untuk tombol "Unarchive Note"
unarchiveButton.addEventListener('click', async function() {
  // Mendapatkan ID catatan yang akan di-unarchive dari atribut data di elemen catatan
  const noteId = this.closest('.note').dataset.id;

  // Meminta konfirmasi dari pengguna sebelum melakukan unarchive catatan
  const unarchiveConfirmed = confirm("Are you sure you want to unarchive this note?");

  // Jika pengguna mengonfirmasi untuk mengunarchive catatan
  if (unarchiveConfirmed) {
    // Memanggil fungsi unarchiveNoteAPI untuk mengunarchive catatan dengan ID yang sesuai
    const isUnarchived = await unarchiveNoteAPI(noteId);

    // Jika catatan berhasil diunarchive, hapus elemen catatan dari tampilan
    if (isUnarchived) {
      this.closest('.note').remove();
    }
  }
});
function renderNotes(notes) {
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.dataset.id = note.id; // Pastikan properti id pada objek catatan sesuai dengan kebutuhan

    const titleElement = document.createElement('h2');
    titleElement.textContent = note.title;

    const bodyElement = document.createElement('p');
    bodyElement.textContent = note.body;

    noteElement.appendChild(titleElement);
    noteElement.appendChild(bodyElement);
    noteElement.appendChild(deleteButton.cloneNode(true));

    notesList.appendChild(noteElement);
  });
}

// Panggil fungsi renderNotes dengan data catatan yang telah Anda dapatkan
renderNotes(notesData);


async function deleteNoteAPI(noteId) {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Note deleted successfully:", data);
      return true;
    } else {
      console.error("Failed to delete note:", data);
      return false;
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
}

// Mengubah event listener untuk tombol hapus
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.addEventListener('click', async function() {
  const noteElement = this.closest('.note');
  if (noteElement) {
    const noteId = noteElement.dataset.id;
    const deleteNote = confirm("Are you sure you want to delete this note?");
    if (deleteNote) {
      const deleteResponse = await deleteNoteAPI(noteId);
      if (deleteResponse) {
        noteElement.remove();
      }
    }
  }
});
