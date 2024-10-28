window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 10) {
    // Jika scroll lebih dari 10px
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// AI
const chatIcon = document.getElementById("chatIcon");
const chatPopup = document.getElementById("chatPopup");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const resizer = document.getElementById("resizer");

chatIcon.addEventListener("click", () => {
  chatPopup.classList.toggle("show");
});

chatIcon.addEventListener("click", () => {
  chatIcon.classList.add("animate-popup");

  setTimeout(() => {
    chatIcon.classList.remove("animate-popup");
  }, 500);
});

resizer.addEventListener("mousedown", function (e) {
  e.preventDefault();
  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
});

function resize(e) {
  const newWidth = chatPopup.offsetWidth - e.movementX;
  const newHeight = chatPopup.offsetHeight - e.movementY;

  // Membatasi ukuran popup agar tidak keluar dari layar
  if (newWidth > 200 && newWidth < window.innerWidth * 0.9) {
    chatPopup.style.width = `${newWidth}px`;
  }
  if (newHeight > 200 && newHeight < window.innerHeight * 0.9) {
    chatPopup.style.height = `${newHeight}px`;
  }
}

function stopResize() {
  window.removeEventListener("mousemove", resize);
  window.removeEventListener("mouseup", stopResize);
}

async function sendMessage() {
  const message = chatInput.value;
  if (message.trim() === "") return;

  // Tambahkan pesan dari pengguna ke dalam chat body
  const userMessageDiv = document.createElement("div");
  userMessageDiv.classList.add("user-message");
  const userMessage = document.createElement("p");
  userMessage.textContent = `You: ${message}`;
  userMessageDiv.appendChild(userMessage);
  chatBody.appendChild(userMessageDiv);
  chatInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  // Tambahkan pesan loading AI
  const loadingMessageDiv = document.createElement("div");
  loadingMessageDiv.classList.add("ai-message");
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "AI: Typing...";

  loadingMessageDiv.appendChild(loadingMessage);
  chatBody.appendChild(loadingMessageDiv);

  try {
    const query = message.trim().startsWith("/")
      ? message.slice(1).trim()
      : message.trim();
    if (query.length > 0) {
      const response = await fetch(
        `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(
          query
        )}`,
        { headers: { accept: "application/json" } }
      );
      const data = await response.json();

      if (data.success) {
        let aiResponse = data.answer;

        // Menambahkan 1 <br> untuk memisahkan paragraf
        aiResponse = aiResponse.replace(/\n/g, "<br>");

        // Hapus pesan loading dan tambahkan pesan dari AI
        loadingMessage.innerHTML = `AI: ${aiResponse}`;
      } else {
        loadingMessage.textContent = "AI: Error, please try again later.";
      }
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  } catch (error) {
    loadingMessage.textContent = "AI: Error, please try again later.";
  }
}

chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Cegah aksi default agar tidak menambah baris baru di input
    event.preventDefault();

    // Panggil fungsi sendMessage untuk mengirim pesan
    sendMessage();
  }
});

// video
// Reset video src on modal close to stop playback
const demoModal = document.getElementById("demoModal");
demoModal.addEventListener("hidden.bs.modal", function () {
  const videoSrc = document.getElementById("demoVideo").src;
  document.getElementById("demoVideo").src = videoSrc.replace(
    "?autoplay=1",
    ""
  );
});
