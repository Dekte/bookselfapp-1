const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  loadFromLocalStorage();
  renderBooks();
});

function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadFromLocalStorage() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books.push(...JSON.parse(storedBooks));
  }
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, task, penulis, timestamp, isCompleted) {
  return {
    id,
    task,
    penulis,
    timestamp,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const { id, task, penulis, timestamp, isCompleted } = bookObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = task;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = penulis;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textPenulis, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "rounded", "bg-gray-200");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });
    undoButton.innerHTML = '<i data-feather="rotate-ccw"></i>';
    container.append(undoButton);

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });
    trashButton.innerHTML = '<i data-feather="trash"></i>';
    container.append(trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });
    checkButton.innerHTML = '<i data-feather="check"></i>';
    feather.replace();
    container.append(checkButton);
  }

  return container;
}

function addBook() {
  const textBook = document.getElementById("title").value;
  const penulis = document.getElementById("penulis").value;
  const timestamp = document.getElementById("date").value;

  if (!textBook || !penulis || !timestamp) {
    alert("Data harus lengkap!");
    return;
  }

  if (isBookExists(textBook)) {
    alert(`Buku dengan judul "${textBook}" sudah ada!`);
    return;
  }

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textBook,
    penulis,
    timestamp,
    false
  );
  books.push(bookObject);

  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
  alert(`Buku "${textBook}" ditambahkan ke rak!`);
}
function isBookExists(title) {
  return books.some((book) => book.task.toLowerCase() === title.toLowerCase());
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  const searchInput = document.getElementById("search-input");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchInput.addEventListener("input", function () {
    renderBooks();
  });

  document.addEventListener(RENDER_EVENT, renderBooks);
});

function renderBooks() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const uncompletedBookList = document.getElementById("books");
  const listCompleted = document.getElementById("completed-books");

  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const title = bookItem.task.toLowerCase();
    const penulis = bookItem.penulis.toLowerCase();

    if (title.includes(searchInput) || penulis.includes(searchInput)) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isCompleted) {
        listCompleted.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  }

  feather.replace();
}
