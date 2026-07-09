/* ==========================================================================
   CRAFTCV APPLICATION LOGIC (VANILLA JS)
   ========================================================================== */

// --- Global Application State ---
let cvState = {
    selectedTemplate: 'classic-executive',
    photo: '',
    fullName: '',
    jobTitle: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    linkedin: '',
    github: '',
    portfolio: '',
    careerSummary: '',
    techSkills: [],
    softSkills: [],
    education: [],
    work: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    hobbies: []
};

// Current Zoom Scale for Preview Page
let previewZoom = 1.0;

// --- Demo Data / Quick Start Data ---
const demoData = {
    selectedTemplate: 'classic-executive',
    photo: '',
    fullName: 'Riya Sharma',
    jobTitle: 'Computer Science Graduate',
    phone: '+91-98765432XX',
    email: 'riya.sharma@email.com',
    address: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    linkedin: 'linkedin.com/in/riyasharma',
    github: 'github.com/riyasharma',
    portfolio: 'riyasharma.dev',
    careerSummary: 'Motivated Computer Science graduate eager to apply programming and analytical skills in a dynamic organization to contribute to impactful projects.',
    techSkills: ['Programming: Python, Java, C++', 'Data Analysis: Excel, SQL, Power BI', 'Frontend: HTML, CSS, JavaScript'],
    softSkills: ['Communication & Teamwork', 'Problem-Solving & Critical Thinking', 'Time Management'],
    education: [
        {
            degree: 'B.Tech in Computer Science',
            institution: 'XYZ University',
            board: 'University Board',
            year: '2024',
            score: 'CGPA: 8.5/10'
        }
    ],
    work: [
        {
            title: 'Technical Intern',
            company: 'TechSolutions Pvt Ltd',
            location: 'New Delhi',
            duration: 'June 2023 - August 2023',
            desc: 'Assisted in developing client-side web components.\nCollaborated on database query optimization tasks, reducing load times by 15%.\nParticipated in daily agile stand-ups and code reviews.'
        }
    ],
    projects: [
        {
            name: 'Library Management System (Java)',
            tech: 'Java, Swing, MySQL',
            desc: 'Developed a desktop application for student records management.\nImplemented user authentication, book issue/return tracking, and search functionalities.',
            github: 'github.com/riyasharma/library-system',
            demo: ''
        },
        {
            name: 'Data Visualization Dashboard',
            tech: 'Power BI, Excel',
            desc: 'Built an interactive dashboard to analyze student performance metrics.\nCreated charts for grade trends, attendance, and graduation rates.',
            github: '',
            demo: 'dashboards.riyasharma.dev'
        }
    ],
    certifications: [
        'Google Data Analytics Professional Certificate',
        'Advanced Excel (Microsoft)'
    ],
    achievements: [
        'Secured 1st Place in College Hackathon (2023)',
        'Class Representative for the CSE Department'
    ],
    languages: [
        'English (Fluent)',
        'Hindi (Fluent)'
    ],
    hobbies: [
        'Coding & Open Source contribution',
        'Reading Tech Blogs',
        'Playing Chess'
    ]
};

// ==========================================================================
// DOM CONTENT LOADED INITIALIZER
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ==========================================================================
// SCROLL FIX
// ==========================================================================
function fixEditorScrollHeight() {
    const header = document.querySelector('.app-header');
    const editorHeader = document.querySelector('.editor-header');
    const editorForm = document.querySelector('.editor-form');
    const previewToolbar = document.querySelector('.preview-toolbar');
    const downloaderBar = document.querySelector('.downloader-bar');
    const previewScrollContainer = document.querySelector('.preview-scroll-container');

    if (!editorForm) return;

    const headerH = header ? header.offsetHeight : 70;
    const editorHeaderH = editorHeader ? editorHeader.offsetHeight : 60;
    const availableH = window.innerHeight - headerH;

    editorForm.style.height = (availableH - editorHeaderH) + 'px';
    editorForm.style.maxHeight = (availableH - editorHeaderH) + 'px';
    editorForm.style.overflowY = 'scroll';
    editorForm.style.overflowX = 'hidden';

    if (previewScrollContainer && previewToolbar && downloaderBar) {
        const used = previewToolbar.offsetHeight + downloaderBar.offsetHeight;
        previewScrollContainer.style.height = (availableH - used) + 'px';
        previewScrollContainer.style.maxHeight = (availableH - used) + 'px';
        previewScrollContainer.style.overflowY = 'auto';
    }
}

function initApp() {
    setupViewNavigation();
    setupThemeToggle();
    setupPhotoHandler();
    setupAccordion();
    setupDynamicFields();
    setupInputListeners();
    setupZoomControls();
    setupExportHandlers();

    fixEditorScrollHeight();
    window.addEventListener('resize', fixEditorScrollHeight);

    const savedData = localStorage.getItem('craftcv_data');
    if (savedData) {
        try {
            cvState = JSON.parse(savedData);
            populateFormFromState();
            updatePreview();
        } catch (e) {
            console.error('Error loading saved data', e);
        }
    } else {
        updatePreview();
    }
}

// ==========================================================================
// VIEW SWITCHING & NAVIGATION
// ==========================================================================
function setupViewNavigation() {
    const btnHome = document.getElementById('nav-btn-home');
    const btnEditor = document.getElementById('nav-btn-editor');
    const logoHome = document.getElementById('logo-home');

    const viewHome = document.getElementById('view-home');
    const viewEditor = document.getElementById('view-editor');

    const switchToHome = () => {
        btnHome.classList.add('active');
        btnEditor.classList.remove('active');
        viewHome.classList.add('active-view');
        viewEditor.classList.remove('active-view');
        document.querySelector('.app-footer').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const switchToEditor = () => {
        btnHome.classList.remove('active');
        btnEditor.classList.add('active');
        viewHome.classList.remove('active-view');
        viewEditor.classList.add('active-view');
        document.querySelector('.app-footer').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fitZoomToContainer();
        setTimeout(fixEditorScrollHeight, 50);
    };

    btnHome.addEventListener('click', switchToHome);
    logoHome.addEventListener('click', switchToHome);
    btnEditor.addEventListener('click', switchToEditor);

    document.getElementById('btn-quick-start').addEventListener('click', () => {
        loadDemoData();
        switchToEditor();
    });

    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        const btnUse = card.querySelector('.btn-use-template');
        const templateId = card.getAttribute('data-template');

        const selectTemplateAndGo = () => {
            cvState.selectedTemplate = templateId;
            document.getElementById('template-select').value = templateId;
            saveStateToLocalStorage();
            updatePreview();
            switchToEditor();
        };

        btnUse.addEventListener('click', (e) => {
            e.stopPropagation();
            selectTemplateAndGo();
        });
        card.addEventListener('click', selectTemplateAndGo);
    });

    const templateSelect = document.getElementById('template-select');
    templateSelect.addEventListener('change', (e) => {
        cvState.selectedTemplate = e.target.value;
        saveStateToLocalStorage();
        updatePreview();
    });
}

// ==========================================================================
// ACCORDION TOGGLES
// ==========================================================================
function setupAccordion() {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const arrow = item.querySelector('.arrow-icon');

        header.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');

            accordions.forEach(acc => {
                acc.classList.remove('expanded');
                const accArrow = acc.querySelector('.arrow-icon');
                if (accArrow) {
                    accArrow.className = 'fa-solid fa-chevron-down arrow-icon';
                }
            });

            if (!isExpanded) {
                item.classList.add('expanded');
                arrow.className = 'fa-solid fa-chevron-up arrow-icon';
            } else {
                item.classList.remove('expanded');
                arrow.className = 'fa-solid fa-chevron-down arrow-icon';
            }
        });
    });
}

// ==========================================================================
// DARK/LIGHT THEME CONTROLLER
// ==========================================================================
function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('craftcv_theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('craftcv_theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// ==========================================================================
// PROFILE PHOTO HANDLER (Base64)
// ==========================================================================
function setupPhotoHandler() {
    const photoInput = document.getElementById('profile-photo');
    const previewImg = document.getElementById('photo-preview-img');
    const placeholderIcon = document.getElementById('photo-placeholder-icon');
    const removeBtn = document.getElementById('btn-remove-photo');

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('File is too large. Maximum size is 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target.result;
            cvState.photo = base64Data;

            previewImg.src = base64Data;
            previewImg.classList.remove('hidden');
            placeholderIcon.classList.add('hidden');
            removeBtn.classList.remove('hidden');

            saveStateToLocalStorage();
            updatePreview();
        };
        reader.readAsDataURL(file);
    });

    removeBtn.addEventListener('click', () => {
        cvState.photo = '';
        photoInput.value = '';

        previewImg.src = '';
        previewImg.classList.add('hidden');
        placeholderIcon.classList.remove('hidden');
        removeBtn.classList.add('hidden');

        saveStateToLocalStorage();
        updatePreview();
    });
}

// ==========================================================================
// ZOOM ENGINE
// ==========================================================================
function setupZoomControls() {
    const wrapper = document.querySelector('.cv-scale-wrapper');
    const zoomVal = document.getElementById('zoom-percentage');

    const setZoom = (zoom) => {
        previewZoom = Math.max(0.4, Math.min(1.5, zoom));
        wrapper.style.transform = `scale(${previewZoom})`;
        zoomVal.innerText = `${Math.round(previewZoom * 100)}%`;

        const container = document.querySelector('.preview-scroll-container');
        const docHeight = 1123 * previewZoom;
        wrapper.parentElement.style.height = `${docHeight + 80}px`;
    };

    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        setZoom(previewZoom + 0.1);
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        setZoom(previewZoom - 0.1);
    });

    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
        setZoom(1.0);
    });

    window.addEventListener('resize', fitZoomToContainer);
}

function fitZoomToContainer() {
    const container = document.querySelector('.preview-scroll-container');
    if (!container || container.clientWidth === 0) return;

    const padding = 40;
    const targetWidth = container.clientWidth - padding;

    if (targetWidth < 794) {
        const scale = targetWidth / 794;
        previewZoom = Math.max(0.4, scale);
    } else {
        previewZoom = 1.0;
    }

    const wrapper = document.querySelector('.cv-scale-wrapper');
    const zoomVal = document.getElementById('zoom-percentage');
    if (wrapper && zoomVal) {
        wrapper.style.transform = `scale(${previewZoom})`;
        zoomVal.innerText = `${Math.round(previewZoom * 100)}%`;
        wrapper.parentElement.style.height = `${(1123 * previewZoom) + 80}px`;
    }
}

// ==========================================================================
// DYNAMIC FIELDS MANAGEMENT
// ==========================================================================
function setupDynamicFields() {
    setupSimpleList('tech-skills-list', 'btn-add-tech-skill', 'techSkills', 'Python, Java, etc.');
    setupSimpleList('soft-skills-list', 'btn-add-soft-skill', 'softSkills', 'Communication, Leadership');
    setupSimpleList('certifications-list', 'btn-add-certification', 'certifications', 'Google Data Analytics Certificate');
    setupSimpleList('achievements-list', 'btn-add-achievement', 'achievements', '1st Position in Hackathon');
    setupSimpleList('languages-list', 'btn-add-language', 'languages', 'English (Fluent)');
    setupSimpleList('hobbies-list', 'btn-add-hobby', 'hobbies', 'Playing Chess');

    setupBlockList('education-blocks', 'btn-add-education', 'education', {
        degree: { label: 'Degree', placeholder: 'B.Tech / MBA' },
        institution: { label: 'Institution / School', placeholder: 'XYZ University' },
        board: { label: 'University / Board', placeholder: 'State Board' },
        year: { label: 'Passing Year', placeholder: '2024' },
        score: { label: 'CGPA / Percentage', placeholder: '8.5 CGPA or 85%' }
    });

    setupBlockList('work-blocks', 'btn-add-work', 'work', {
        title: { label: 'Job Title', placeholder: 'Software Engineer' },
        company: { label: 'Company Name', placeholder: 'Google LLC' },
        location: { label: 'Location', placeholder: 'New York, NY' },
        duration: { label: 'Duration', placeholder: 'Jan 2022 - Present' },
        desc: { label: 'Description', placeholder: 'Responsibilities, technologies used...', textarea: true }
    });

    setupBlockList('project-blocks', 'btn-add-project', 'projects', {
        name: { label: 'Project Name', placeholder: 'E-Commerce Platform' },
        tech: { label: 'Technologies Used', placeholder: 'React, Node.js, MongoDB' },
        desc: { label: 'Description', placeholder: 'Brief explanation of the project features...', textarea: true },
        github: { label: 'GitHub Link (Optional)', placeholder: 'github.com/user/project' },
        demo: { label: 'Live Demo Link (Optional)', placeholder: 'project.live' }
    });

    document.getElementById('btn-clear-form').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all details? This cannot be undone.')) {
            clearForm();
        }
    });
}

function setupSimpleList(containerId, addBtnId, stateKey, placeholder) {
    const container = document.getElementById(containerId);
    const addBtn = document.getElementById(addBtnId);

    const renderItem = (value = '') => {
        const row = document.createElement('div');
        row.className = 'dynamic-item-row';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.placeholder = placeholder;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-text-danger';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

        row.appendChild(input);
        row.appendChild(deleteBtn);
        container.appendChild(row);

        input.addEventListener('input', () => {
            collectSimpleListData(container, stateKey);
        });

        deleteBtn.addEventListener('click', () => {
            row.remove();
            collectSimpleListData(container, stateKey);
        });
    };

    addBtn.addEventListener('click', () => {
        renderItem();
    });

    container.renderItem = renderItem;
}

function collectSimpleListData(container, stateKey) {
    const inputs = container.querySelectorAll('.dynamic-item-row input');
    cvState[stateKey] = [];
    inputs.forEach(input => {
        const val = input.value.trim();
        if (val) {
            cvState[stateKey].push(val);
        }
    });
    saveStateToLocalStorage();
    updatePreview();
}

function setupBlockList(containerId, addBtnId, stateKey, fieldsSchema) {
    const container = document.getElementById(containerId);
    const addBtn = document.getElementById(addBtnId);

    const renderBlock = (data = {}) => {
        const block = document.createElement('div');
        block.className = 'dynamic-block-item';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove-block';
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        block.appendChild(removeBtn);

        const grid = document.createElement('div');
        grid.className = 'form-grid';

        Object.keys(fieldsSchema).forEach(fieldKey => {
            const field = fieldsSchema[fieldKey];
            const group = document.createElement('div');
            group.className = 'form-group';

            if (fieldKey === 'desc') {
                group.className = 'form-group col-span-2';
            }

            const label = document.createElement('label');
            label.innerText = field.label;

            let input;
            if (field.textarea) {
                input = document.createElement('textarea');
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = 'text';
            }

            input.value = data[fieldKey] || '';
            input.placeholder = field.placeholder;
            input.dataset.key = fieldKey;

            group.appendChild(label);
            group.appendChild(input);
            grid.appendChild(group);

            input.addEventListener('input', () => {
                collectBlockListData(container, stateKey);
            });
        });

        block.appendChild(grid);
        container.appendChild(block);

        removeBtn.addEventListener('click', () => {
            block.remove();
            collectBlockListData(container, stateKey);
        });
    };

    addBtn.addEventListener('click', () => {
        renderBlock();
    });

    container.renderBlock = renderBlock;
}

function collectBlockListData(container, stateKey) {
    const blocks = container.querySelectorAll('.dynamic-block-item');
    cvState[stateKey] = [];

    blocks.forEach(block => {
        const fields = block.querySelectorAll('input, textarea');
        let blockObj = {};
        let hasValues = false;

        fields.forEach(field => {
            const val = field.value.trim();
            const key = field.dataset.key;
            blockObj[key] = val;
            if (val) hasValues = true;
        });

        if (hasValues) {
            cvState[stateKey].push(blockObj);
        }
    });

    saveStateToLocalStorage();
    updatePreview();
}

// ==========================================================================
// VALUE INPUT SYNC ENGINE
// ==========================================================================
function setupInputListeners() {
    const textInputs = [
        { id: 'full-name', key: 'fullName' },
        { id: 'job-title', key: 'jobTitle' },
        { id: 'phone-number', key: 'phone' },
        { id: 'email-address', key: 'email' },
        { id: 'street-address', key: 'address' },
        { id: 'city', key: 'city' },
        { id: 'state', key: 'state' },
        { id: 'country', key: 'country' },
        { id: 'linkedin-url', key: 'linkedin' },
        { id: 'github-url', key: 'github' },
        { id: 'portfolio-url', key: 'portfolio' },
        { id: 'career-summary', key: 'careerSummary' }
    ];

    textInputs.forEach(item => {
        const element = document.getElementById(item.id);
        element.addEventListener('input', (e) => {
            cvState[item.key] = e.target.value;
            saveStateToLocalStorage();
            updatePreview();
        });
    });
}

// ==========================================================================
// STATE SAVE & LOADING MANAGEMENT
// ==========================================================================
function saveStateToLocalStorage() {
    localStorage.setItem('craftcv_data', JSON.stringify(cvState));
}

function populateFormFromState() {
    document.getElementById('full-name').value = cvState.fullName || '';
    document.getElementById('job-title').value = cvState.jobTitle || '';
    document.getElementById('phone-number').value = cvState.phone || '';
    document.getElementById('email-address').value = cvState.email || '';
    document.getElementById('street-address').value = cvState.address || '';
    document.getElementById('city').value = cvState.city || '';
    document.getElementById('state').value = cvState.state || '';
    document.getElementById('country').value = cvState.country || '';
    document.getElementById('linkedin-url').value = cvState.linkedin || '';
    document.getElementById('github-url').value = cvState.github || '';
    document.getElementById('portfolio-url').value = cvState.portfolio || '';
    document.getElementById('career-summary').value = cvState.careerSummary || '';
    document.getElementById('template-select').value = cvState.selectedTemplate || 'classic-executive';

    const previewImg = document.getElementById('photo-preview-img');
    const placeholderIcon = document.getElementById('photo-placeholder-icon');
    const removeBtn = document.getElementById('btn-remove-photo');

    if (cvState.photo) {
        previewImg.src = cvState.photo;
        previewImg.classList.remove('hidden');
        placeholderIcon.classList.add('hidden');
        removeBtn.classList.remove('hidden');
    } else {
        previewImg.src = '';
        previewImg.classList.add('hidden');
        placeholderIcon.classList.remove('hidden');
        removeBtn.classList.add('hidden');
    }

    const listMap = [
        { id: 'tech-skills-list', key: 'techSkills' },
        { id: 'soft-skills-list', key: 'softSkills' },
        { id: 'certifications-list', key: 'certifications' },
        { id: 'achievements-list', key: 'achievements' },
        { id: 'languages-list', key: 'languages' },
        { id: 'hobbies-list', key: 'hobbies' }
    ];

    listMap.forEach(mapItem => {
        const container = document.getElementById(mapItem.id);
        container.innerHTML = '';
        if (cvState[mapItem.key] && cvState[mapItem.key].length > 0) {
            cvState[mapItem.key].forEach(val => {
                container.renderItem(val);
            });
        }
    });

    const blockMap = [
        { id: 'education-blocks', key: 'education' },
        { id: 'work-blocks', key: 'work' },
        { id: 'project-blocks', key: 'projects' }
    ];

    blockMap.forEach(mapItem => {
        const container = document.getElementById(mapItem.id);
        container.innerHTML = '';
        if (cvState[mapItem.key] && cvState[mapItem.key].length > 0) {
            cvState[mapItem.key].forEach(val => {
                container.renderBlock(val);
            });
        }
    });
}

function clearForm() {
    cvState = {
        selectedTemplate: 'classic-executive',
        photo: '',
        fullName: '',
        jobTitle: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        linkedin: '',
        github: '',
        portfolio: '',
        careerSummary: '',
        techSkills: [],
        softSkills: [],
        education: [],
        work: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        hobbies: []
    };

    const formInputs = document.querySelectorAll('#cv-form input, #cv-form textarea');
    formInputs.forEach(input => input.value = '');

    document.getElementById('profile-photo').value = '';
    document.getElementById('photo-preview-img').src = '';
    document.getElementById('photo-preview-img').classList.add('hidden');
    document.getElementById('photo-placeholder-icon').classList.remove('hidden');
    document.getElementById('btn-remove-photo').classList.add('hidden');

    document.getElementById('tech-skills-list').innerHTML = '';
    document.getElementById('soft-skills-list').innerHTML = '';
    document.getElementById('education-blocks').innerHTML = '';
    document.getElementById('work-blocks').innerHTML = '';
    document.getElementById('project-blocks').innerHTML = '';
    document.getElementById('certifications-list').innerHTML = '';
    document.getElementById('achievements-list').innerHTML = '';
    document.getElementById('languages-list').innerHTML = '';
    document.getElementById('hobbies-list').innerHTML = '';

    localStorage.removeItem('craftcv_data');
    updatePreview();
}

function loadDemoData() {
    cvState = JSON.parse(JSON.stringify(demoData));
    populateFormFromState();
    updatePreview();
    saveStateToLocalStorage();
}

// ==========================================================================
// RENDERING LIVE PREVIEW ENGINE
// ==========================================================================
function updatePreview() {
    const previewContainer = document.getElementById('cv-preview-document');
    if (!previewContainer) return;

    previewContainer.className = `cv-preview-container template-${cvState.selectedTemplate}`;
    previewContainer.innerHTML = '';

    switch (cvState.selectedTemplate) {
        case 'classic-executive':
            renderClassicTemplate(previewContainer);
            break;
        case 'elegant-minimalist':
            renderMinimalistTemplate(previewContainer);
            break;
        case 'creative-tech':
            renderCreativeTemplate(previewContainer);
            break;
        case 'warm-slate':
            renderWarmSlateTemplate(previewContainer);
            break;
    }
}

function hasContactInfo() {
    return cvState.phone || cvState.email || cvState.address || cvState.city || cvState.state || cvState.country || cvState.linkedin || cvState.github || cvState.portfolio;
}

function getFormattedLocation() {
    let loc = [];
    if (cvState.address) loc.push(cvState.address);
    if (cvState.city) loc.push(cvState.city);
    if (cvState.state) loc.push(cvState.state);
    if (cvState.country) loc.push(cvState.country);
    return loc.join(', ');
}

// RENDER: TEMPLATE 1 - CLASSIC EXECUTIVE
function renderClassicTemplate(container) {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';

    if (cvState.photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'cv-photo-circle';
        photoContainer.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        sidebar.appendChild(photoContainer);
    }

    if (hasContactInfo()) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Contact</h3>`;

        const list = document.createElement('div');
        list.className = 'sidebar-contact';

        if (cvState.phone) list.innerHTML += `<div><i class="fa-solid fa-phone"></i> ${cvState.phone}</div>`;
        if (cvState.email) list.innerHTML += `<div><i class="fa-solid fa-envelope"></i> ${cvState.email}</div>`;

        const location = getFormattedLocation();
        if (location) list.innerHTML += `<div><i class="fa-solid fa-location-dot"></i> ${location}</div>`;

        if (cvState.linkedin) list.innerHTML += `<div><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</div>`;
        if (cvState.github) list.innerHTML += `<div><i class="fa-brands fa-github"></i> ${cvState.github}</div>`;
        if (cvState.portfolio) list.innerHTML += `<div><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</div>`;

        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    if (cvState.certifications && cvState.certifications.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Certifications</h3>`;

        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        cvState.certifications.forEach(cert => {
            list.innerHTML += `<li>${cert}</li>`;
        });

        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    if (cvState.languages && cvState.languages.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Languages</h3>`;

        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        cvState.languages.forEach(lang => {
            list.innerHTML += `<li>${lang}</li>`;
        });

        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    if (cvState.hobbies && cvState.hobbies.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Hobbies</h3>`;

        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        cvState.hobbies.forEach(hobby => {
            list.innerHTML += `<li>${hobby}</li>`;
        });

        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    const main = document.createElement('div');
    main.className = 'main-content';

    if (cvState.fullName || cvState.jobTitle) {
        const header = document.createElement('div');
        header.className = 'main-header';
        header.innerHTML = `
            ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
            ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
        `;
        main.appendChild(header);
    }

    if (cvState.careerSummary) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-bullseye"></i> Career Objective</div>
            <p class="cv-item-desc">${cvState.careerSummary}</p>
        `;
        main.appendChild(sec);
    }

    if (cvState.techSkills && cvState.techSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-laptop-code"></i> Key Skills</div>
        `;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.techSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        main.appendChild(sec);
    }

    if (cvState.softSkills && cvState.softSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-people-arrows"></i> Soft Skills</div>
        `;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.softSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        main.appendChild(sec);
    }

    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>
        `;
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${edu.degree}</span>
                        <span>${edu.year}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${edu.institution}${edu.board ? ` | ${edu.board}` : ''}</span>
                        <span>${edu.score}</span>
                    </div>
                </div>
            `;
        });
        main.appendChild(sec);
    }

    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-briefcase"></i> Work Experience</div>
        `;
        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company}</span>
                        <span>${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        main.appendChild(sec);
    }

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-diagram-project"></i> Academic Projects</div>
        `;
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`GitHub: <a href="https://${proj.github}" target="_blank">${proj.github}</a>`);
            if (proj.demo) links.push(`Live: <a href="https://${proj.demo}" target="_blank">${proj.demo}</a>`);
            const linksStr = links.join(' | ');

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name} ${proj.tech ? `(${proj.tech})` : ''}</span>
                    </div>
                    ${linksStr ? `<div class="cv-item-subheader">${linksStr}</div>` : ''}
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        main.appendChild(sec);
    }

    if (cvState.achievements && cvState.achievements.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-trophy"></i> Achievements</div>
        `;
        const list = document.createElement('ul');
        list.className = 'cv-list-items';
        cvState.achievements.forEach(ach => {
            list.innerHTML += `<li>${ach}</li>`;
        });
        sec.appendChild(list);
        main.appendChild(sec);
    }

    container.appendChild(sidebar);
    container.appendChild(main);
}

// RENDER: TEMPLATE 2 - ELEGANT MINIMALIST
function renderMinimalistTemplate(container) {
    const headerBlock = document.createElement('div');
    headerBlock.className = 'header-block';

    if (cvState.photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'cv-photo-circle';
        photoContainer.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        headerBlock.appendChild(photoContainer);
    }

    const headerText = document.createElement('div');
    headerText.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;
    headerBlock.appendChild(headerText);

    if (hasContactInfo()) {
        const contactRow = document.createElement('div');
        contactRow.className = 'contact-horizontal';

        if (cvState.phone) contactRow.innerHTML += `<span><i class="fa-solid fa-phone"></i> ${cvState.phone}</span>`;
        if (cvState.email) contactRow.innerHTML += `<span><i class="fa-solid fa-envelope"></i> ${cvState.email}</span>`;

        const location = getFormattedLocation();
        if (location) contactRow.innerHTML += `<span><i class="fa-solid fa-location-dot"></i> ${location}</span>`;

        if (cvState.linkedin) contactRow.innerHTML += `<span><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</span>`;
        if (cvState.github) contactRow.innerHTML += `<span><i class="fa-brands fa-github"></i> ${cvState.github}</span>`;
        if (cvState.portfolio) contactRow.innerHTML += `<span><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</span>`;

        headerBlock.appendChild(contactRow);
    }
    container.appendChild(headerBlock);

    const bodyContent = document.createElement('div');
    bodyContent.className = 'body-content';

    if (cvState.careerSummary) {
        bodyContent.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Career Summary</div>
                <p class="cv-item-desc" style="font-family: Georgia, serif; font-style: italic;">${cvState.careerSummary}</p>
            </div>
        `;
    }

    if ((cvState.techSkills && cvState.techSkills.length > 0) || (cvState.softSkills && cvState.softSkills.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Skills Overview</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';

        if (cvState.techSkills) {
            cvState.techSkills.forEach(skill => {
                grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
            });
        }
        if (cvState.softSkills) {
            cvState.softSkills.forEach(skill => {
                grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
            });
        }
        sec.appendChild(grid);
        bodyContent.appendChild(sec);
    }

    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Education</div>`;

        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${edu.degree}</span>
                        <span>${edu.year}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${edu.institution}${edu.board ? `, ${edu.board}` : ''}</span>
                        <span>${edu.score}</span>
                    </div>
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Professional Experience</div>`;

        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company} &mdash; ${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Academic & Personal Projects</div>`;

        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`GitHub: ${proj.github}`);
            if (proj.demo) links.push(`Demo: ${proj.demo}`);
            const linksStr = links.length > 0 ? ` (${links.join(', ')})` : '';

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name} &ndash; <i>${proj.tech}</i></span>
                    </div>
                    ${linksStr ? `<div class="cv-item-subheader">${linksStr}</div>` : ''}
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

    if ((cvState.certifications && cvState.certifications.length > 0) || (cvState.achievements && cvState.achievements.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Certifications & Achievements</div>`;

        const list = document.createElement('ul');
        list.className = 'cv-list-items';

        if (cvState.certifications) {
            cvState.certifications.forEach(cert => {
                list.innerHTML += `<li>${cert} (Certificate)</li>`;
            });
        }
        if (cvState.achievements) {
            cvState.achievements.forEach(ach => {
                list.innerHTML += `<li>${ach}</li>`;
            });
        }
        sec.appendChild(list);
        bodyContent.appendChild(sec);
    }

    if ((cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Personal Details</div>`;

        let details = [];
        if (cvState.languages && cvState.languages.length > 0) {
            details.push(`<strong>Languages:</strong> ${cvState.languages.join(', ')}`);
        }
        if (cvState.hobbies && cvState.hobbies.length > 0) {
            details.push(`<strong>Interests:</strong> ${cvState.hobbies.join(', ')}`);
        }

        sec.innerHTML += `<p class="cv-item-desc">${details.join('<br>')}</p>`;
        bodyContent.appendChild(sec);
    }

    container.appendChild(bodyContent);
}

// RENDER: TEMPLATE 3 - CREATIVE TECH
function renderCreativeTemplate(container) {
    const banner = document.createElement('div');
    banner.className = 'top-banner';

    const bannerInfo = document.createElement('div');
    bannerInfo.className = 'header-info';
    bannerInfo.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;
    banner.appendChild(bannerInfo);

    if (cvState.photo) {
        const bannerPhoto = document.createElement('div');
        bannerPhoto.className = 'banner-photo';
        const photoCircle = document.createElement('div');
        photoCircle.className = 'cv-photo-circle';
        photoCircle.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        bannerPhoto.appendChild(photoCircle);
        banner.appendChild(bannerPhoto);
    }
    container.appendChild(banner);

    const creativeBody = document.createElement('div');
    creativeBody.className = 'creative-body';

    const leftPane = document.createElement('div');
    leftPane.className = 'left-pane';

    if (cvState.careerSummary) {
        leftPane.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title"><i class="fa-solid fa-user"></i> About Me</div>
                <p class="cv-item-desc">${cvState.careerSummary}</p>
            </div>
        `;
    }

    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-briefcase"></i> Experience</div>`;

        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company} &bull; ${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        leftPane.appendChild(sec);
    }

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-terminal"></i> Key Projects</div>`;

        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`<a href="https://${proj.github}" target="_blank"><i class="fa-brands fa-github"></i> Source</a>`);
            if (proj.demo) links.push(`<a href="https://${proj.demo}" target="_blank"><i class="fa-solid fa-laptop"></i> Live</a>`);
            const linksStr = links.length > 0 ? ` &nbsp; ${links.join(' &bull; ')}` : '';

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name}</span>
                    </div>
                    <div class="cv-item-subheader" style="font-family: inherit; font-size:11.5px;">
                        <span>Tech: ${proj.tech}</span>
                        <span>${linksStr}</span>
                    </div>
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        leftPane.appendChild(sec);
    }

    const rightPane = document.createElement('div');
    rightPane.className = 'right-pane';

    if (hasContactInfo()) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-address-book"></i> Connect</div>`;

        const list = document.createElement('div');
        list.className = 'contact-vertical';

        if (cvState.phone) list.innerHTML += `<div><i class="fa-solid fa-phone"></i> ${cvState.phone}</div>`;
        if (cvState.email) list.innerHTML += `<div><i class="fa-solid fa-envelope"></i> ${cvState.email}</div>`;

        const location = getFormattedLocation();
        if (location) list.innerHTML += `<div><i class="fa-solid fa-location-dot"></i> ${location}</div>`;

        if (cvState.linkedin) list.innerHTML += `<div><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</div>`;
        if (cvState.github) list.innerHTML += `<div><i class="fa-brands fa-github"></i> ${cvState.github}</div>`;
        if (cvState.portfolio) list.innerHTML += `<div><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</div>`;

        sec.appendChild(list);
        rightPane.appendChild(sec);
    }

    if (cvState.techSkills && cvState.techSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-code"></i> Tech Stack</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.techSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        rightPane.appendChild(sec);
    }

    if (cvState.softSkills && cvState.softSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-handshake"></i> Soft Skills</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.softSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        rightPane.appendChild(sec);
    }

    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>`;
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block" style="font-size:12px;">
                    <div style="font-weight:700;">${edu.degree}</div>
                    <div style="color:#718096; font-size:11px;">${edu.institution} (${edu.year})</div>
                    <div style="font-style:italic; font-size:11px;">${edu.score}</div>
                </div>
            `;
        });
        rightPane.appendChild(sec);
    }

    if ((cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-sparkles"></i> More</div>`;

        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        list.style.listStyleType = 'none';
        list.style.fontSize = '12px';
        list.style.paddingLeft = '0';

        if (cvState.languages) {
            cvState.languages.forEach(lang => {
                list.innerHTML += `<li><i class="fa-solid fa-comment-dots" style="color:#7c3aed; margin-right:6px;"></i> ${lang}</li>`;
            });
        }
        if (cvState.hobbies) {
            cvState.hobbies.forEach(hobby => {
                list.innerHTML += `<li><i class="fa-solid fa-heart" style="color:#7c3aed; margin-right:6px;"></i> ${hobby}</li>`;
            });
        }
        sec.appendChild(list);
        rightPane.appendChild(sec);
    }

    creativeBody.appendChild(leftPane);
    creativeBody.appendChild(rightPane);
    container.appendChild(creativeBody);
}

// RENDER: TEMPLATE 4 - WARM SLATE
function renderWarmSlateTemplate(container) {
    const mainArea = document.createElement('div');
    mainArea.className = 'main-area';

    mainArea.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;

    if (cvState.careerSummary) {
        mainArea.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Summary</div>
                <p class="cv-item-desc">${cvState.careerSummary}</p>
            </div>
        `;
    }

    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Employment History</div>`;
        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company}, ${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        mainArea.appendChild(sec);
    }

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Personal Projects</div>`;
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`<a href="https://${proj.github}" target="_blank" style="color:#ea580c;">GitHub</a>`);
            if (proj.demo) links.push(`<a href="https://${proj.demo}" target="_blank" style="color:#ea580c;">Demo</a>`);
            const linksStr = links.length > 0 ? ` &bull; ${links.join(' &bull; ')}` : '';

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>Stack: ${proj.tech}</span>
                        <span>${linksStr}</span>
                    </div>
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        mainArea.appendChild(sec);
    }

    const sidePane = document.createElement('div');
    sidePane.className = 'side-pane';

    if (cvState.photo) {
        const photoCircle = document.createElement('div');
        photoCircle.className = 'cv-photo-circle';
        photoCircle.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        sidePane.appendChild(photoCircle);
    }

    if (hasContactInfo()) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Details</div>`;

        const list = document.createElement('div');
        list.className = 'contact-list';

        if (cvState.phone) list.innerHTML += `<div><i class="fa-solid fa-phone"></i> ${cvState.phone}</div>`;
        if (cvState.email) list.innerHTML += `<div><i class="fa-solid fa-envelope"></i> ${cvState.email}</div>`;

        const location = getFormattedLocation();
        if (location) list.innerHTML += `<div><i class="fa-solid fa-location-dot"></i> ${location}</div>`;

        if (cvState.linkedin) list.innerHTML += `<div><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</div>`;
        if (cvState.github) list.innerHTML += `<div><i class="fa-brands fa-github"></i> ${cvState.github}</div>`;
        if (cvState.portfolio) list.innerHTML += `<div><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</div>`;

        sec.appendChild(list);
        sidePane.appendChild(sec);
    }

    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Education</div>`;
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block" style="font-size:11.5px; margin-bottom:10px;">
                    <div style="font-weight:700;">${edu.degree}</div>
                    <div style="color:#52525b;">${edu.institution}</div>
                    <div>Year: ${edu.year}</div>
                    <div style="font-style:italic; font-size:11px;">${edu.score}</div>
                </div>
            `;
        });
        sidePane.appendChild(sec);
    }

    if (cvState.techSkills && cvState.techSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Skills</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.techSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        sidePane.appendChild(sec);
    }

    if (cvState.achievements && cvState.achievements.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Achievements</div>`;
        const list = document.createElement('ul');
        list.className = 'cv-list-items';
        list.style.fontSize = '11px';
        list.style.paddingLeft = '14px';
        cvState.achievements.forEach(ach => {
            list.innerHTML += `<li>${ach}</li>`;
        });
        sec.appendChild(list);
        sidePane.appendChild(sec);
    }

    container.appendChild(mainArea);
    container.appendChild(sidePane);
}

// ==========================================================================
// IMAGE EXPORT — High Resolution PNG Download
//
// Uses html2canvas directly on the live CV element.
// Temporarily removes the CSS transform so the element is captured
// at its natural 794px width, then restores it after download.
// Scale of 3 gives ~2382px wide output — sharp on any screen or printer.
// ==========================================================================
function setupExportHandlers() {
    document.getElementById('btn-download-pdf').addEventListener('click', () => {
        downloadImage();
    });
}

function downloadImage() {
    const btn = document.getElementById('btn-download-pdf');
    const cvEl = document.getElementById('cv-preview-document');
    const scaleWrapper = document.querySelector('.cv-scale-wrapper');
    const fullName = cvState.fullName || 'craftcv_resume';
    const filename = `resume_${fullName.replace(/\s+/g, '_').toLowerCase()}.png`;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    // Remove zoom transform so the element sits at its natural 794px width
    const originalTransform = scaleWrapper.style.transform;
    scaleWrapper.style.transform = 'none';

    // Collect all page <style> blocks so the clone has identical CSS
    // (this is what fixes the black sidebar — background colours need CSS)
    let styleText = '';
    document.querySelectorAll('style').forEach(s => { styleText += s.innerHTML; });

    const cvWidth  = cvEl.scrollWidth;
    const cvHeight = cvEl.scrollHeight;

    // Build a self-contained SVG that wraps the CV HTML via foreignObject.
    // Because everything is inlined, there are zero CORS/taint restrictions
    // and dark backgrounds (like the sidebar) render correctly.
    const svgData = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        '     width="' + cvWidth + '" height="' + cvHeight + '">',
        '  <foreignObject width="100%" height="100%">',
        '    <div xmlns="http://www.w3.org/1999/xhtml">',
        '      <style>' + styleText + '</style>',
        '      <div class="' + cvEl.className + '"',
        '           style="width:' + cvWidth + 'px;background:#fff;overflow:visible;">',
        cvEl.innerHTML,
        '      </div>',
        '    </div>',
        '  </foreignObject>',
        '</svg>'
    ].join('\n');

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl  = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = () => {
        scaleWrapper.style.transform = originalTransform;

        const scale  = 3;
        const canvas = document.createElement('canvas');
        canvas.width  = cvWidth  * scale;
        canvas.height = cvHeight * scale;

        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cvWidth, cvHeight);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();

        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-image"></i> Download Image';
    };

    // Fallback: if SVG foreignObject is blocked by the browser,
    // use html2canvas with onclone to force background colours
    img.onerror = () => {
        URL.revokeObjectURL(svgUrl);

        html2canvas(cvEl, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: (clonedDoc) => {
                clonedDoc.querySelectorAll('*').forEach(el => {
                    el.style.webkitPrintColorAdjust = 'exact';
                    el.style.printColorAdjust = 'exact';
                });
            }
        }).then(canvas => {
            scaleWrapper.style.transform = originalTransform;
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-image"></i> Download Image';
        }).catch(err => {
            console.error('Image export failed:', err);
            scaleWrapper.style.transform = originalTransform;
            alert('Image generation failed. Please try again.');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-image"></i> Download Image';
        });
    };

    img.src = svgUrl;
}
