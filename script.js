// ===========================
// Olideen Technologies Animations & Interactivity
// ===========================

// GSAP Navbar Animation
gsap.from(".navbar", {
  duration: 1,
  y: -100,
  opacity: 0,
  ease: "power3.out"
});

// GSAP Logo Animation (pulse effect)
gsap.to(".logo-icon", {
  scale: 1.05,
  repeat: -1,
  yoyo: true,
  duration: 2,
  ease: "power1.inOut"
});

// Smooth fade-in for footer
gsap.from(".footer", {
  scrollTrigger: {
    trigger: ".footer",
    start: "top bottom", // when footer enters viewport
    toggleActions: "play none none none"
  },
  duration: 1.5,
  opacity: 0,
  y: 50,
  ease: "power2.out"
});

// Highlight nav links on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Contact form validation
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("input[name='name']");
    const email = form.querySelector("input[name='email']");
    const message = form.querySelector("textarea[name='message']");

    if (!name.value || !email.value || !message.value) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    // Simple email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.value.match(emailPattern)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Thank you for contacting Olideen Technologies! We'll get back to you soon.");
    form.reset();
  });
}
// GSAP Animations
gsap.from(".hero-content", {opacity: 0, y: -50, duration: 1});
gsap.from(".footer", {y: 100, duration: 1, scrollTrigger: ".footer"});
gsap.to(".logo-3d", {scale: 1.1, repeat: -1, yoyo: true, duration: 2});

// Testimonials Carousel
let index = 0;
const testimonials = document.querySelectorAll(".testimonial");
function showTestimonial() {
  testimonials.forEach((t, i) => {
    t.style.opacity = i === index ? "1" : "0";
  });
  index = (index + 1) % testimonials.length;
}
setInterval(showTestimonial, 3000);

// Contact Form Validation
function validateForm() {
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  if (!email.value.includes("@")) {
    email.style.border = "2px solid red";
    return false;
  }
  if (message.value.trim() === "") {
    message.style.border = "2px solid red";
    return false;
  }
  return true;
}

// CTA Section Animations
gsap.from(".cta-content h2", {
  opacity: 0,
  y: -30,
  duration: 1,
  scrollTrigger: ".cta-content h2"
});

gsap.from(".cta-content p", {
  opacity: 0,
  y: -20,
  duration: 1,
  delay: 0.3,
  scrollTrigger: ".cta-content p"
});

gsap.from(".cta-btn", {
  opacity: 0,
  y: 40,
  duration: 1,
  delay: 0.6,
  ease: "bounce.out",
  scrollTrigger: ".cta-btn"
});
