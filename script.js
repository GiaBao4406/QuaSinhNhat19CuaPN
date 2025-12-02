// =======================================================
//                   PHẦN 1: THIẾT LẬP CHUNG
// =======================================================
const textElement = document.getElementById("typing-text");
const container = document.querySelector(".container");
const message = document.querySelector(".message");
const ctaButton = document.querySelector(".cta-button");
const giftRevealContent = document.getElementById("giftRevealContent");

const birthdaySong = document.getElementById("birthdaySong");
const giftVideo = document.getElementById("giftVideo");

const fullText = "Chúc mừng sinh nhật Phương Nhung!";
let i = 0;
let fireworksInterval;

// MẢNG CHỨA 3 VIDEO (Đảm bảo có file video3.mp4 trong thư mục media/)
const videoSources = [
  "media/video.mp4",
  "media/video2.mp4",
  "media/video3.mp4",
];
let currentVideoIndex = 0;

// =======================================================
//                   PHẦN 2: HIỆU ỨNG GÕ CHỮ
// =======================================================

function typeWriter() {
  if (i < fullText.length) {
    textElement.innerHTML += fullText.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  } else {
    message.style.display = "block";
    ctaButton.style.display = "inline-block";

    startFireworks();

    ctaButton.addEventListener("click", handleGiftButtonClick);
  }
}
window.onload = typeWriter;

// =======================================================
//                   PHẦN 3: CANVAS & HIỆU ỨNG ĐỘNG
// =======================================================
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
const hearts = [];
let W = window.innerWidth;
let H = window.innerHeight;

canvas.width = W;
canvas.height = H;

window.addEventListener("resize", () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
});

// --- Hạt Pháo Hoa (Particle) ---
function Particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.vx = Math.random() * 4 - 2;
  this.vy = Math.random() * 4 - 2;
  this.color = color;
  this.alpha = 1;
  this.gravity = 0.05;
}
Particle.prototype.draw = function () {
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
};
Particle.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += this.gravity;
  this.alpha -= 0.01;
};
function createExplosion(x, y) {
  const hue = Math.random() * 360;
  const color = `hsl(${hue}, 100%, 70%)`;
  for (let j = 0; j < 50; j++) {
    particles.push(new Particle(x, y, color));
  }
}

// --- Hạt Trái Tim (Heart) ---
const heartImage = new Image();
heartImage.src =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2YwMDA2YSI+PHBhdGggZD0iTTEyIDQuMjQzYy00LjcwNi00LjAzMi0xMi0uMDA1LTEyIDUuNzIyIDAgMi42ODggMS41MyA0LjgyNyAzLjgxNSA2LjUxOEwxMiAyMmw4LjE4NS01LjUyNmMxLjgyNS0xLjI0NyAyLjg5MS0yLjk0NyAzLjgxNS00LjY3NyAwLTUuNzI3LTcuMjg0LTkuNzU0LTEyLTUuNzIyIi8+PC9zdmc+";

function Heart(x, y) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 8 + 5;
  this.alpha = 1;
  this.vy = -(Math.random() * 2 + 1);
  this.vx = Math.random() * 0.5 - 0.25;
}
Heart.prototype.draw = function () {
  ctx.globalAlpha = this.alpha;
  if (heartImage.complete) {
    ctx.drawImage(
      heartImage,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
  ctx.globalAlpha = 1;
};
Heart.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  this.alpha -= 0.005;
};

// --- Vòng Lặp Animation Chính (loop) ---
function loop() {
  ctx.fillStyle = "rgba(18, 18, 18, 0.1)";
  ctx.fillRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();
    if (hearts[i].alpha <= 0) {
      hearts.splice(i, 1);
    }
  }

  requestAnimationFrame(loop);
}

function startFireworks() {
  fireworksInterval = setInterval(() => {
    const x = Math.random() * W;
    const y = Math.random() * H * 0.7;
    createExplosion(x, y);
  }, 500);
  requestAnimationFrame(loop);
}

function startHearts() {
  setInterval(() => {
    const x = Math.random() * W;
    const y = H;
    hearts.push(new Heart(x, y));
  }, 100);
}

// =======================================================
//                   PHẦN 4: XỬ LÝ NÚT "NHẬN QUÀ"
// =======================================================

function setupVideoLoop() {
  giftVideo.addEventListener("ended", function () {
    // Logic tự động xử lý 3 video lặp lại
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;

    giftVideo.style.opacity = 0;

    setTimeout(() => {
      giftVideo.src = videoSources[currentVideoIndex];
      giftVideo.currentTime = 0;

      giftVideo.style.opacity = 1;
      giftVideo
        .play()
        .catch((e) => console.error("Lỗi phát video sau khi đổi nguồn:", e));
    }, 500);
  });
}

function handleGiftButtonClick(e) {
  e.preventDefault();

  setupVideoLoop();

  container.style.transition = "opacity 0.5s ease-out";
  container.style.opacity = "0";

  setTimeout(() => {
    container.style.display = "none";

    // BẮT ĐẦU CHƠI NHẠC
    birthdaySong.play().catch((error) => {
      console.error("Lỗi phát nhạc:", error);
    });

    // BẮT ĐẦU PHÁT VIDEO 1
    giftVideo.play().catch((error) => {
      console.error("Lỗi phát video lần đầu:", error);
    });

    // HIỂN THỊ NỘI DUNG QUÀ
    giftRevealContent.classList.remove("hidden");
    setTimeout(() => {
      giftRevealContent.style.opacity = "1";
    }, 10);
  }, 500);
}
