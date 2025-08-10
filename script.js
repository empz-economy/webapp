document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM Elements
  const elements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    countdownDays: document.getElementById("countdown-days"),
    teamGrid: document.getElementById("teamGrid"), 
  };

  // Team page
  if (elements.teamGrid) {
    const specialCardHTML = `
      <div class="team-card-container">
        <div class="home-card">
          <div class="home-buttons">
            <a href="index.html" class="home-button">← Return Home</a>
            <a href="docs/volunteer.pdf" target="_blank" class="volunteer-button">Volunteer →</a>
          </div>
          <div class="department-key">
            <h4>Department Key</h4>
            <div class="key-list">
              <div class="key-item"><i class="fa-solid fa-crown"></i><span>= President</span></div>
              <div class="key-item"><i class="fa-solid fa-code"></i><span>= Development</span></div>
              <div class="key-item"><i class="fa-solid fa-bitcoin-sign"></i><span>= Crypto</span></div>
              <div class="key-item"><i class="fa-solid fa-seedling"></i><span>= Business</span></div>
              <div class="key-item"><i class="fa-solid fa-bullhorn"></i><span>= Shilling</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    fetch(`https://gist.githubusercontent.com/e-m-p-z/4dc05b6505d9e37c8c5e29618571e57f/raw/team.json?t=${Date.now()}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        elements.teamGrid.innerHTML = '';
        data.teamMembers.forEach(member => {
          if (member.type === 'specialCard') {
            elements.teamGrid.innerHTML += specialCardHTML;
          } else {
            elements.teamGrid.innerHTML += `
              <div class="team-card-container">
                <div class="team-card">
                  <div class="card-front">
                    <div class="member-emoji"><i class="${member.icon}"></i></div>
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-title">${member.title}</p>
                  </div>
                  <div class="card-back">
                    <p class="member-bio">${member.bio}</p>
                    <div class="social-links">
                      ${member.social.twitter ? `
                        <a href="https://x.com/${member.social.twitter.replace('@','')}" target="_blank" class="social-button twitter-button">
                          <span>𝕏</span> ${member.social.twitter}
                        </a>
                      ` : ''}
                      ${member.social.github ? `
                        <a href="https://github.com/${member.social.github.replace('@','')}" target="_blank" class="social-button github-button">
                          <img src="elements/github.png" class="github-icon" alt="GitHub"> ${member.social.github}
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
        });
      })
      .catch(error => {
        console.error('Failed to fetch team data:', error);
        elements.teamGrid.innerHTML = `
          <div class="error-message">
            Team data unavailable. Please try again later.
          </div>
        `;
      });
  }

    // Erkan AI
  if (elements.countdownDays) {
    const targetDate = new Date("2026-02-28T00:00:00Z").getTime();
    if (isNaN(targetDate)) {
      elements.countdownDays.textContent = "ERR";
      return;
    }

    function updateErkanAICountdown() {
      const now = new Date().getTime();
      const timeRemaining = targetDate - now;
      if (timeRemaining <= 0) {
        elements.countdownDays.textContent = "0";
        clearInterval(countdownIntervalErkanAI);
        return;
      }
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      elements.countdownDays.textContent = days;
    }

    const countdownIntervalErkanAI = setInterval(updateErkanAICountdown, 1000);
    updateErkanAICountdown();
  }

  const featureCards = document.querySelectorAll(".feature-card");
  const taxCard = document.querySelector(".tax-card");
  const statItems = document.querySelectorAll(".stat-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  featureCards.forEach((card) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  if (taxCard) {
    taxCard.style.opacity = 0;
    taxCard.style.transform = "translateY(20px)";
    taxCard.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(taxCard);
  }

  statItems.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform = "translateY(20px)";
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Error 404
  if (elements.days && elements.hours && elements.minutes && elements.seconds) {
    const targetDate = new Date("2027-09-12T00:00:00Z").getTime();
    if (isNaN(targetDate)) {
      elements.days.textContent = "ERR";
      elements.hours.textContent = "ERR";
      elements.minutes.textContent = "ERR";
      elements.seconds.textContent = "ERR";
      return;
    }

    function update404Countdown() {
      const now = new Date().getTime();
      const timeRemaining = targetDate - now;
      if (timeRemaining <= 0) {
        elements.days.textContent = "00";
        elements.hours.textContent = "00";
        elements.minutes.textContent = "00";
        elements.seconds.textContent = "00";
        clearInterval(countdownInterval404);
        return;
      }
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      elements.days.textContent = String(days).padStart(2, "0");
      elements.hours.textContent = String(hours).padStart(2, "0");
      elements.minutes.textContent = String(minutes).padStart(2, "0");
      elements.seconds.textContent = String(seconds).padStart(2, "0");
    }

    const countdownInterval404 = setInterval(update404Countdown, 1000);
    update404Countdown();
  }
});