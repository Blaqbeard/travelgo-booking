const API_BASE_URL = "https://travelgo-booking.onrender.com";
// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Back to top button
const backToTopButton = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton?.classList.remove("opacity-0", "invisible");
    backToTopButton?.classList.add("opacity-100", "visible");
  } else {
    backToTopButton?.classList.add("opacity-0", "invisible");
    backToTopButton?.classList.remove("opacity-100", "visible");
  }
});

backToTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }
  });
});

// Scroll animations
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("opacity-100", "translate-x-0", "translate-y-0");
          el.classList.remove(
            "opacity-0",
            "translate-y-5",
            "translate-x-10",
            "-translate-x-10"
          );
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    const direction = el.dataset.animate;
    const delay = el.dataset.delay || "0";
    const duration = el.dataset.duration || "700";

    el.classList.add("opacity-0", "transition-all", "ease-out");
    el.style.transitionDelay = `${delay}ms`;
    el.style.transitionDuration = `${duration}ms`;

    if (direction === "left") {
      el.classList.add("-translate-x-10");
    } else if (direction === "right") {
      el.classList.add("translate-x-10");
    } else if (direction === "zoom-in") {
      el.classList.add("scale-90");
    } else {
      el.classList.add("translate-y-5");
    }

    observer.observe(el);
  });
});

// --- Destinations Filtering Logic ---
let allDestinations = [];
let currentDestPage = 1;
const destinationsPerPage = 6;
let filteredDestinations = [];

function renderDestinations(destinations) {
  const container = document.getElementById("destinations-list");
  if (!container) return;
  container.innerHTML = "";
  destinations.forEach((dest) => {
    const div = document.createElement("div");
    div.className =
      "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300";
    div.innerHTML = `
      <img src="images/${dest.image}" alt="${
      dest.name
    }" class="w-full h-64 object-cover" />
      <div class="p-6">
        <h3 class="text-xl font-semibold mb-2">${dest.name}</h3>
        <p class="text-gray-600 mb-4">${dest.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-sky-500">${
            dest.region ? dest.region : ""
          }</span>
          <a href="packages.html" class="text-sky-500 hover:text-sky-600 font-medium">
            View Packages <i class="bi bi-arrow-right ml-1"></i>
          </a>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateLoadMoreDestinationsButton() {
  const loadMoreBtn = document.getElementById("load-more-destinations");
  if (loadMoreBtn) {
    const totalPages = Math.ceil(
      filteredDestinations.length / destinationsPerPage
    );
    if (filteredDestinations.length === 0 || currentDestPage >= totalPages) {
      loadMoreBtn.classList.add("hidden");
      loadMoreBtn.disabled = true;
      loadMoreBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      loadMoreBtn.classList.remove("hidden");
      loadMoreBtn.disabled = false;
      loadMoreBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("destinations.html")) {
    fetch(`${API_BASE_URL}/api/destinations`)
      .then((res) => res.json())
      .then((destinations) => {
        allDestinations = destinations;
        filteredDestinations = destinations;
        currentDestPage = 1;
        renderDestinations(filteredDestinations.slice(0, destinationsPerPage));
        updateLoadMoreDestinationsButton();
      })
      .catch((err) => {
        console.error("Failed to fetch destinations:", err);
      });

    // Load More Destinations button
    const loadMoreBtn = document.getElementById("load-more-destinations");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        currentDestPage++;
        const startIndex = (currentDestPage - 1) * destinationsPerPage;
        const endIndex = startIndex + destinationsPerPage;
        const newDestinations = filteredDestinations.slice(0, endIndex);
        renderDestinations(newDestinations);
        updateLoadMoreDestinationsButton();
      });
    }

    // Search bar filtering (on button click only)
    const searchForm = document.querySelector("form");
    if (searchForm) {
      const searchBtn = searchForm.querySelector(
        'button[type="button"], button:not([type])'
      );
      if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const region = document.getElementById("destination")?.value;
          const type = document.getElementById("type")?.value;
          let filtered = allDestinations;
          if (region)
            filtered = filtered.filter(
              (d) => d.region && d.region.toLowerCase() === region.toLowerCase()
            );
          if (type)
            filtered = filtered.filter(
              (d) => d.type && d.type.toLowerCase() === type.toLowerCase()
            );
          filteredDestinations = filtered;
          currentDestPage = 1;
          renderDestinations(
            filteredDestinations.slice(0, destinationsPerPage)
          );
          updateLoadMoreDestinationsButton();
        });
      }
    }

    // Explore By Region section filtering
    document
      .querySelectorAll(".grid.grid-cols-2.md\\:grid-cols-4.gap-4 a")
      .forEach((regionLink) => {
        regionLink.addEventListener("click", (e) => {
          e.preventDefault();
          const regionName = regionLink
            .querySelector("h3")
            ?.textContent?.trim();
          if (regionName) {
            const filtered = allDestinations.filter(
              (d) =>
                d.region && d.region.toLowerCase() === regionName.toLowerCase()
            );
            filteredDestinations = filtered;
            currentDestPage = 1;
            renderDestinations(
              filteredDestinations.slice(0, destinationsPerPage)
            );
            updateLoadMoreDestinationsButton();
          }
        });
      });
  }
});

// Move these to the top of the file, before any event listeners or functions:
let allPackages = [];
let filteredPackages = [];
let currentPage = 1;
const packagesPerPage = 6;

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("packages.html")) {
    fetch(`${API_BASE_URL}/api/packages`)
      .then((res) => res.json())
      .then((packages) => {
        allPackages = packages;
        filteredPackages = packages;
        renderPackages(packages.slice(0, packagesPerPage));
        updateLoadMoreButton();
      })
      .catch((err) => {
        console.error("Failed to fetch packages:", err);
      });

    // Load More button functionality
    const loadMoreBtn = document.getElementById("load-more-packages");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        currentPage++;
        // Declare startIndex and endIndex only once
        const startIndex = (currentPage - 1) * packagesPerPage;
        const endIndex = startIndex + packagesPerPage;
        const newPackages = filteredPackages.slice(startIndex, endIndex);

        const container = document.getElementById("packages-list");
        newPackages.forEach((pkg) => {
          const div = document.createElement("div");
          div.className =
            "bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300";
          div.innerHTML = `
            <div class="relative">
              <img src="images/${pkg.image}" alt="${pkg.name}" class="w-full h-48 object-cover" />
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold mb-1">${pkg.name}</h3>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-sky-500">₦${pkg.price}k</p>
                  <p class="text-gray-500 text-sm">per person</p>
                </div>
              </div>
              <p class="mb-4">${pkg.description}</p>
              <ul class="space-y-3 mb-6">
                <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 mr-2"></i><span>Duration: ${pkg.duration}</span></li>
                <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 mr-2"></i><span>Destination: ${pkg.destination}</span></li>
              </ul>
              <div class="flex space-x-3">
                <button class="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300 fullpage-book-now-btn" data-pkg-id="${pkg._id}">Book Now</button>
                <button onclick="openDetailsModal('${pkg._id}')" class="flex-1 border border-sky-500 text-sky-500 hover:bg-sky-50 font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300">Details</button>
              </div>
            </div>
          `;
          // Attach full-page booking handler
          // div.querySelector(".fullpage-book-now-btn").onclick = () =>
          //   showFullpageBookingForm(pkg);
          container.appendChild(div);
        });

        updateLoadMoreButton();
      });
    }

    // Search bar filtering (on button click only)
    const searchForm = document.querySelector("form");
    if (searchForm) {
      const searchBtn = searchForm.querySelector(
        'button[type="button"], button:not([type])'
      );
      if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const destination = document.getElementById("destination")?.value;
          const duration = document.getElementById("duration")?.value;
          const price = document.getElementById("price")?.value;
          const type = document.getElementById("type")?.value;

          let filtered = allPackages;

          if (destination) {
            filtered = filtered.filter(
              (pkg) =>
                pkg.destination &&
                pkg.destination
                  .toLowerCase()
                  .includes(destination.toLowerCase())
            );
          }

          if (duration) {
            filtered = filtered.filter((pkg) => {
              if (!pkg.duration) return false;
              const pkgDuration = pkg.duration.toLowerCase();
              if (duration === "3-5")
                return (
                  pkgDuration.includes("3") ||
                  pkgDuration.includes("4") ||
                  pkgDuration.includes("5")
                );
              if (duration === "6-8")
                return (
                  pkgDuration.includes("6") ||
                  pkgDuration.includes("7") ||
                  pkgDuration.includes("8")
                );
              if (duration === "9-11")
                return (
                  pkgDuration.includes("9") ||
                  pkgDuration.includes("10") ||
                  pkgDuration.includes("11")
                );
              if (duration === "12+")
                return (
                  pkgDuration.includes("12") ||
                  pkgDuration.includes("14") ||
                  pkgDuration.includes("15")
                );
              return false;
            });
          }

          if (price) {
            filtered = filtered.filter((pkg) => {
              const pkgPrice = pkg.price;
              if (price === "500-800")
                return pkgPrice >= 500 && pkgPrice <= 800;
              if (price === "800-1200")
                return pkgPrice >= 800 && pkgPrice <= 1200;
              if (price === "1200-2000")
                return pkgPrice >= 1200 && pkgPrice <= 2000;
              if (price === "2000+") return pkgPrice >= 2000;
              return false;
            });
          }

          if (type) {
            filtered = filtered.filter((pkg) => pkg.type && pkg.type === type);
          }

          filteredPackages = filtered;
          currentPage = 1;
          renderPackages(filtered.slice(0, packagesPerPage));
          updateLoadMoreButton();
        });
      }
    }
  }
});

// --- Full-Page Booking Logic ---
function showFullpageBookingForm(pkg) {
  // Hide all main content and modals
  document.getElementById("packages-section").classList.add("hidden");
  const filterSection = document.querySelector("section.bg-sky-100");
  if (filterSection) filterSection.classList.add("hidden");
  document.getElementById("detailsModal")?.classList.add("hidden");
  // Show booking section
  document
    .getElementById("fullpage-booking-section")
    .classList.remove("hidden");
  // Fill in package info
  document.getElementById(
    "fullpage-booking-title"
  ).textContent = `Book: ${pkg.name}`;
  document.getElementById("fullpage-booking-package").value = pkg.name;
  document.getElementById("fullpage-booking-price").value = `₦${pkg.price}k`;
  document
    .getElementById("fullpage-booking-form")
    .setAttribute("data-package-id", pkg._id);
}

function hideFullpageBookingForm() {
  document.getElementById("fullpage-booking-section").classList.add("hidden");
  document.getElementById("packages-section").classList.remove("hidden");
  const filterSection = document.querySelector("section.bg-sky-100");
  if (filterSection) filterSection.classList.remove("hidden");
  document.getElementById("fullpage-booking-form").reset();
}

document.addEventListener("DOMContentLoaded", () => {
  // Attach close/cancel handlers
  document.getElementById("close-fullpage-booking").onclick =
    hideFullpageBookingForm;
  document.getElementById("cancel-fullpage-booking").onclick =
    hideFullpageBookingForm;
  // Booking form submission
  document.getElementById("fullpage-booking-form").onsubmit = function (e) {
    e.preventDefault();
    const formData = {
      packageId: this.getAttribute("data-package-id"),
      name: document.getElementById("fullpage-booking-name").value,
      email: document.getElementById("fullpage-booking-email").value,
      phone: document.getElementById("fullpage-booking-phone").value,
      travelDate: document.getElementById("fullpage-booking-date").value,
      guests: document.getElementById("fullpage-booking-guests").value,
      message: document.getElementById("fullpage-booking-message").value,
    };
    fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Booking submitted successfully! We will contact you soon.");
          hideFullpageBookingForm();
        } else {
          alert("Failed to submit booking. Please try again.");
        }
      })
      .catch(() => {
        alert("Failed to submit booking. Please try again.");
      });
  };
});

// --- Fix Load More Button Logic ---
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more-packages");
  if (loadMoreBtn) {
    const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);
    if (filteredPackages.length === 0 || currentPage >= totalPages) {
      loadMoreBtn.classList.add("hidden");
      loadMoreBtn.disabled = true;
      loadMoreBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      loadMoreBtn.classList.remove("hidden");
      loadMoreBtn.disabled = false;
      loadMoreBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }
}

// Modal Functions
function openBookingModal(packageId, packageName, packagePrice) {
  // If details modal is open, close it
  const detailsModal = document.getElementById("detailsModal");
  if (detailsModal && !detailsModal.classList.contains("hidden")) {
    detailsModal.classList.add("hidden");
  }
  document.getElementById("bookingPackageName").value = packageName;
  document.getElementById("bookingPackagePrice").value = `₦${packagePrice}k`;
  document.getElementById("bookingModal").classList.remove("hidden");
  // Store package ID for form submission
  document
    .getElementById("bookingForm")
    .setAttribute("data-package-id", packageId);
}

function closeBookingModal() {
  document.getElementById("bookingModal").classList.add("hidden");
  document.getElementById("bookingForm").reset();
}

function openDetailsModal(packageId) {
  // Fetch package details from API
  fetch(`${API_BASE_URL}/api/packages/${packageId}`)
    .then((res) => res.json())
    .then((package) => {
      const detailsContainer = document.getElementById("packageDetails");
      detailsContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img src="images/${package.image}" alt="${package.name}" class="w-full h-64 object-cover rounded-lg">
          </div>
          <div class="space-y-4">
            <h4 class="text-2xl font-bold text-gray-800">${package.name}</h4>
            <p class="text-gray-600">${package.description}</p>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">Price:</span>
                <span class="text-sky-500 font-bold">₦${package.price}k per person</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Duration:</span>
                <span>${package.duration}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Destination:</span>
                <span>${package.destination}</span>
              </div>
            </div>
            <div class="pt-4">
              <button class="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 details-book-now-btn" data-pkg-id="${package._id}">
                Book This Package
              </button>
            </div>
          </div>
        </div>
      `;
      document.getElementById("detailsModal").classList.remove("hidden");
      // Attach full-page booking handler
      detailsContainer.querySelector(".details-book-now-btn").onclick = () => {
        document.getElementById("detailsModal").classList.add("hidden");
        showFullpageBookingForm(package);
      };
    })
    .catch((err) => {
      console.error("Failed to fetch package details:", err);
      alert("Failed to load package details. Please try again.");
    });
}

function closeDetailsModal() {
  document.getElementById("detailsModal").classList.add("hidden");
}

// Booking form submission
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        packageId: bookingForm.getAttribute("data-package-id"),
        name: document.getElementById("bookingName").value,
        email: document.getElementById("bookingEmail").value,
        phone: document.getElementById("bookingPhone").value,
        travelDate: document.getElementById("bookingDate").value,
        guests: document.getElementById("bookingGuests").value,
        message: document.getElementById("bookingMessage").value,
      };

      // Submit booking to backend
      fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Booking submitted successfully! We will contact you soon.");
            closeBookingModal();
          } else {
            alert("Failed to submit booking. Please try again.");
          }
        })
        .catch((err) => {
          console.error("Booking submission error:", err);
          alert("Failed to submit booking. Please try again.");
        });
    });
  }
});

// --- SPA Router for Booking Page ---
function renderBookingPage(packageId) {
  // Fetch package details and render booking form
  fetch(`${API_BASE_URL}/api/packages/${packageId}`)
    .then((res) => res.json())
    .then((pkg) => {
      document.body.innerHTML = `
        <main class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div class="w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-xl shadow-2xl bg-white overflow-y-auto max-h-[95vh] flex flex-col mt-8 mb-8">
            <div class="flex items-center justify-between mb-8 mt-2">
              <div class="flex items-center gap-3">
                <div class="bg-sky-100 text-sky-500 rounded-full p-2">
                  <i class="bi bi-calendar2-check text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800">Book: ${pkg.name}</h3>
              </div>
              <button id="cancel-booking" class="text-gray-400 hover:text-gray-700 text-2xl" aria-label="Cancel booking">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <form id="spa-booking-form" class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div class="col-span-1 md:col-span-2">
                <label class="block text-gray-700 mb-2">Package</label>
                <input type="text" value="${pkg.name}" readonly class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800" />
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Price</label>
                <input type="text" value="₦${pkg.price}k" readonly class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800" />
              </div>
              <div>
                <label for="spa-booking-name" class="block text-gray-700 mb-2">Full Name *</label>
                <input type="text" id="spa-booking-name" required class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label for="spa-booking-email" class="block text-gray-700 mb-2">Email *</label>
                <input type="email" id="spa-booking-email" required class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label for="spa-booking-phone" class="block text-gray-700 mb-2">Phone *</label>
                <input type="tel" id="spa-booking-phone" required class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label for="spa-booking-date" class="block text-gray-700 mb-2">Travel Date *</label>
                <input type="date" id="spa-booking-date" required class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label for="spa-booking-guests" class="block text-gray-700 mb-2">Number of Guests *</label>
                <select id="spa-booking-guests" required class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Select number of guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6+">6+ Guests</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label for="spa-booking-message" class="block text-gray-700 mb-2">Special Requests</label>
                <textarea id="spa-booking-message" rows="3" class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Any special requests or requirements..."></textarea>
              </div>
            </form>
            <div class="flex space-x-3 pt-6 pb-2 mt-4">
              <button type="submit" form="spa-booking-form" class="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300">Submit Booking</button>
              <button type="button" id="cancel-booking-2" class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors duration-300">Cancel</button>
            </div>
          </div>
        </main>
      `;
      // Back and Cancel handlers
      document.getElementById("cancel-booking").onclick = () => {
        window.location.search = "";
      };
      document.getElementById("cancel-booking-2").onclick = () => {
        window.location.search = "";
      };
      // Form submission
      document.getElementById("spa-booking-form").onsubmit = function (e) {
        e.preventDefault();
        const formData = {
          packageId: packageId,
          name: document.getElementById("spa-booking-name").value,
          email: document.getElementById("spa-booking-email").value,
          phone: document.getElementById("spa-booking-phone").value,
          travelDate: document.getElementById("spa-booking-date").value,
          guests: document.getElementById("spa-booking-guests").value,
          message: document.getElementById("spa-booking-message").value,
        };
        fetch(`${API_BASE_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert(
                "Booking submitted successfully! We will contact you soon."
              );
              window.location.search = "";
            } else {
              alert("Failed to submit booking. Please try again.");
            }
          })
          .catch(() => {
            alert("Failed to submit booking. Please try again.");
          });
      };
    });
}

function spaRouter() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get("booking");
  if (bookingId) {
    renderBookingPage(bookingId);
  } else {
    window.location.reload(); // fallback: reload to packages grid
  }
}

// Patch Book Now buttons to redirect
function patchBookNowButtons() {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("fullpage-book-now-btn")) {
      const pkgId = e.target.getAttribute("data-pkg-id");
      window.location.search = `?booking=${pkgId}`;
    }
    if (e.target.classList.contains("details-book-now-btn")) {
      const pkgId = e.target.getAttribute("data-pkg-id");
      window.location.search = `?booking=${pkgId}`;
    }
  });
}

// On page load, patch Book Now buttons and check router
if (window.location.search.includes("booking=")) {
  spaRouter();
} else {
  patchBookNowButtons();
}

// Patch package rendering to use full-page booking
function renderPackages(packages) {
  const container = document.getElementById("packages-list");
  if (!container) return;
  container.innerHTML = "";
  packages.forEach((pkg) => {
    const div = document.createElement("div");
    div.className =
      "bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300";
    div.innerHTML = `
      <div class="relative">
        <img src="images/${pkg.image}" alt="${pkg.name}" class="w-full h-48 object-cover" />
      </div>
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold mb-1">${pkg.name}</h3>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-sky-500">₦${pkg.price}k</p>
            <p class="text-gray-500 text-sm">per person</p>
          </div>
        </div>
        <p class="mb-4">${pkg.description}</p>
        <ul class="space-y-3 mb-6">
          <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 mr-2"></i><span>Duration: ${pkg.duration}</span></li>
          <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 mr-2"></i><span>Destination: ${pkg.destination}</span></li>
        </ul>
        <div class="flex space-x-3">
          <button class="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300 fullpage-book-now-btn" data-pkg-id="${pkg._id}">Book Now</button>
          <button onclick="openDetailsModal('${pkg._id}')" class="flex-1 border border-sky-500 text-sky-500 hover:bg-sky-50 font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300">Details</button>
        </div>
      </div>
    `;
    // Only update the URL for Book Now, let SPA router handle the rest
    div.querySelector(".fullpage-book-now-btn").onclick = () => {
      window.location.search = `?booking=${pkg._id}`;
    };
    container.appendChild(div);
  });
}

// --- Dynamic Home Page Enhancements ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Hero Rotation
  const heroHeadlines = [
    {
      headline: "Travel from anywhere around the world with ease.",
      desc: "Explore new destinations, cultures, and adventures with TravelGO. Your journey begins here!",
    },
    {
      headline: "Unforgettable Journeys Await You.",
      desc: "Book premium packages, discover hidden gems, and travel with confidence.",
    },
    {
      headline: "Adventure, Relaxation, and Culture in One Place.",
      desc: "From group tours to luxury escapes, we have the perfect trip for you.",
    },
  ];
  let heroIndex = 0;
  function rotateHero() {
    const h = document.getElementById("hero-headline");
    const d = document.getElementById("hero-desc");
    if (h && d) {
      h.textContent = heroHeadlines[heroIndex].headline;
      d.textContent = heroHeadlines[heroIndex].desc;
      heroIndex = (heroIndex + 1) % heroHeadlines.length;
    }
  }
  rotateHero();
  setInterval(rotateHero, 5000);

  // 2. Dynamic Features (simulate fetch)
  const features = [
    {
      icon: "bi-globe2",
      title: "Global Destinations",
      desc: "Travel to over 100+ countries with curated experiences.",
    },
    {
      icon: "bi-people",
      title: "Expert Guides",
      desc: "Local experts ensure you get the most authentic experience.",
    },
    {
      icon: "bi-shield-check",
      title: "Safe & Secure",
      desc: "Your safety and comfort are our top priorities.",
    },
    {
      icon: "bi-star",
      title: "Premium Service",
      desc: "Enjoy 24/7 support and premium travel perks.",
    },
  ];
  const featuresList = document.getElementById("features-list");
  if (featuresList) {
    featuresList.innerHTML = features
      .map(
        (f) => `
      <div class="bg-white p-8 rounded-lg shadow-md text-center" data-animate="fade-up">
        <div class="text-sky-500 text-4xl mb-4">
          <i class="bi ${f.icon}"></i>
        </div>
        <h3 class="text-xl font-semibold mb-4">${f.title}</h3>
        <p class="text-gray-600 mb-6">${f.desc}</p>
      </div>
    `
      )
      .join("");
  }

  // 3. Dynamic Header Greeting
  const greeting = document.getElementById("dynamic-header-greeting");
  if (greeting) {
    const hour = new Date().getHours();
    let greet = "Welcome, Traveler!";
    if (hour < 12) greet = "Good morning, Traveler!";
    else if (hour < 18) greet = "Good afternoon, Traveler!";
    else greet = "Good evening, Traveler!";
    greeting.textContent = greet;
    greeting.classList.remove("hidden");
  }

  // 4. Enhance Buttons
  document.querySelectorAll("button, a").forEach((btn) => {
    btn.classList.add(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-sky-300",
      "transition",
      "duration-150"
    );
    btn.addEventListener("mousedown", () => btn.classList.add("scale-95"));
    btn.addEventListener("mouseup", () => btn.classList.remove("scale-95"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("scale-95"));
  });

  // 5. Leaflet.js Map Integration (visually appealing)
  if (window.L && document.getElementById("google-map")) {
    const map = L.map("google-map").setView([20, 0], 2);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);
    // Example destinations (replace with real data if available)
    const destinations = [
      { name: "Bali, Indonesia", lat: -8.409518, lng: 115.188919 },
      { name: "Santorini, Greece", lat: 36.3932, lng: 25.4615 },
      { name: "Maui, Hawaii", lat: 20.7984, lng: -156.3319 },
      { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
      { name: "Tokyo, Japan", lat: 35.6895, lng: 139.6917 },
    ];
    destinations.forEach((dest) => {
      const marker = L.marker([dest.lat, dest.lng], {
        icon: L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        }),
      }).addTo(map);
      marker.bindPopup(
        `<span class='font-semibold text-sky-700'>${dest.name}</span>`
      );
    });
  }
});
