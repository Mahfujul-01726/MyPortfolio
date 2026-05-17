$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
            document.querySelector('header').classList.remove('scrolled');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

});

// <!-- Web3Forms to mail contact form data -->
function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('SUCCESS!', data);
                form.reset();
                alert('Form Submitted Successfully! You will receive an email shortly.');
            } else {
                console.log('FAILED...', data);
                alert('Form Submission Failed! Try Again');
            }
        })
        .catch(error => {
            console.log('ERROR...', error);
            alert('An error occurred. Please try again.');
        });
    return false;
}
// <!-- Web3Forms to mail contact form data -->

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Welcome To Mahfuj's Portfolio";
        }
        else {
            document.title = "Come Back To Portfolio";
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["Data Science", "Artificial Intelligence", "NLP", "Generative AI", "Robotics"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

// Enhanced interactive skills display
function showSkills(skillsData) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    let currentFilter = "all";

    // Store all skills with their categories
    const allSkills = [];
    const categories = {
        frontend: skillsData.frontend || [],
        backend: skillsData.backend || [],
        datascience: skillsData.datascience || [],
        databases: skillsData.databases || [],
        tools: skillsData.tools || []
    };

    // Flatten skills for filtering
    for (const [category, skills] of Object.entries(categories)) {
        skills.forEach(skill => {
            allSkills.push({ ...skill, category });
        });
    }

    // Function to render skills
    function renderSkills(filter = "all") {
        skillHTML = "";
        let filteredSkills = filter === "all" ? allSkills : allSkills.filter(s => s.category === filter);

        filteredSkills.forEach((skill, index) => {
            const proficiency = skill.proficiency || 80;
            const projectsHtml = skill.projects && skill.projects.length > 0
                ? skill.projects.map(p => `<span class="project-tag" title="${p}">${p}</span>`).join('')
                : '<span class="project-tag" style="opacity: 0.5;">No projects yet</span>';

            skillHTML += `
                <div class="skill-card fade-in" data-category="${skill.category}" style="animation-delay: ${index * 0.05}s">
                    <div class="skill-content">
                        <div class="skill-icon">
                            <img src="${skill.icon}" alt="${skill.name}" loading="lazy" />
                        </div>
                        <h3 class="skill-name">${skill.name}</h3>
                        <p class="skill-description">${skill.description || 'Expert in this technology'}</p>
                        
                        <div class="proficiency-container">
                            <div class="proficiency-label">
                                <span>Proficiency</span>
                                <span>${proficiency}%</span>
                            </div>
                            <div class="proficiency-bar">
                                <div style="--proficiency: ${proficiency}%"></div>
                            </div>
                        </div>
                        
                        <div class="skill-projects">
                            ${projectsHtml}
                        </div>
                        
                        <div class="skill-category">${skill.category}</div>
                    </div>
                </div>
            `;
        });

        skillsContainer.innerHTML = skillHTML;
        attachSkillCardHovers();
    }

    // Attach hover effects and animations
    function attachSkillCardHovers() {
        const skillCards = document.querySelectorAll(".skill-card");
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = '';
                }, 10);
            });
        });
    }

    // Initial render
    renderSkills();

    // Setup filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            // Update active state
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");
            currentFilter = filter;

            // Animate skills out and in
            const skillCards = document.querySelectorAll(".skill-card");
            skillCards.forEach(card => card.classList.add("fade-out"));

            setTimeout(() => {
                renderSkills(filter);
            }, 200);
        });
    });
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        projectHTML += `
        <div class="box tilt">
      <img draggable="false" src="${project.image}" alt="project" />
      <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            ${project.links.view ? `<a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>` : ''}
            ${project.links.code ? `<a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>` : ''}
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

}

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL COURSES */
srtop.reveal('.courses .box', { interval: 200 });

/* SCROLL BLOG */
srtop.reveal('.blog .box', { interval: 200 });

/* SCROLL TECHNEWS */
srtop.reveal('.technews .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
// Note: Contact form intentionally excluded from ScrollReveal reset
// to prevent form fields from becoming invisible. The heading is still
// animated via the custom ScrollReveal class in enhancements.js.
// srtop.reveal('.contact .container', { delay: 400 });
// srtop.reveal('.contact .container .form-group', { delay: 400 });

// About section image slideshow
const aboutImages = ["./assets/images/mahfuj.jpg", "./assets/images/mypic.jpg"];
let currentIndex = 0;
const aboutImg = document.getElementById("about-slideshow");
if (aboutImg) {
  setInterval(() => {
    currentIndex = (currentIndex + 1) % aboutImages.length;
    aboutImg.src = aboutImages[currentIndex];
  }, 3000);
}