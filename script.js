document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS
  AOS.init();

  // Smooth scroll for navbar links
  $(".nav-link").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });
});

// go to top:
// Get the button
const goToTopBtn = document.getElementById("goToTopBtn");

// Show the button when scrolling down 100px from the top
window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    goToTopBtn.classList.remove("hidden");
    goToTopBtn.classList.add("animate-bounce-in");
  } else {
    goToTopBtn.classList.add("hidden");
    goToTopBtn.classList.remove("animate-bounce-in");
  }
};

// When the button is clicked, scroll to the top of the document
goToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
