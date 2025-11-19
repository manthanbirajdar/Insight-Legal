// Global variables
let chatMessages = [];
let isAnalyzing = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupEventListeners();
    setupSmoothScrolling();
    setupFAQToggle();
    setupFormHandlers();
    
    // Set minimum date for consultation booking to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.querySelector('#consultationForm input[type="date"]');
    if (dateInput) {
        dateInput.min = today;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Handle file input change
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Handle drag and drop for file upload
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
        uploadArea.addEventListener('dragleave', handleDragLeave);
    }
    
    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup FAQ toggle functionality
function setupFAQToggle() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Risk assessment form
    const riskForm = document.getElementById('riskForm');
    if (riskForm) {
        riskForm.addEventListener('submit', handleRiskAssessment);
    }
    
    // Consultation form
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleConsultationBooking);
    }
}

// Chatbot Functions
function toggleChatbot() {
    const chatbotModal = document.getElementById('chatbotModal');
    if (chatbotModal.classList.contains('hidden')) {
        openChatbot();
    } else {
        closeChatbot();
    }
}

function openChatbot() {
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotModal.classList.remove('hidden');
    
    // Focus on chat input
    setTimeout(() => {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.focus();
    }, 300);
}

function closeChatbot() {
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotModal.classList.add('hidden');
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const responses = {
        'contract': 'I can help you analyze contracts for potential risks, compliance issues, and key terms. Our AI system reviews clauses, identifies unusual provisions, and provides recommendations. Would you like to upload a contract for analysis?',
        'legal advice': 'I provide general legal information and can guide you to relevant resources. For specific legal advice tailored to your situation, I recommend booking a consultation with one of our legal experts. Would you like me to help you schedule a consultation?',
        'document': 'Our document analysis service can review various legal documents including contracts, agreements, legal notices, and compliance documents. We identify risks, check for compliance, and provide detailed reports. The service costs ₹100. Would you like to start an analysis?',
        'risk': 'Our risk assessment tool evaluates potential legal risks for your business or situation. We analyze your industry, business type, and specific concerns to provide a comprehensive risk profile with recommendations. The assessment costs ₹80. Shall I help you get started?',
        'consultation': 'Our legal consultation sessions connect you with experienced lawyers who provide personalized advice backed by AI research. Sessions cost ₹150 and can be scheduled within 24 hours. Would you like to book a consultation?',
        'pricing': 'Our services are affordably priced: Document Analysis - ₹100, Risk Assessment - ₹80, Consultation Session - ₹150. All services include detailed reports and recommendations. Which service interests you most?',
        'security': 'We use bank-level encryption and security measures to protect your documents and personal information. Your data is never shared with third parties, and all communications are encrypted. Your privacy and security are our top priorities.',
        'hello': 'Hello! I\'m your AI legal assistant. I can help you with document analysis, risk assessment, legal consultations, and answer questions about our services. How can I assist you today?',
        'help': 'I can help you with: 📄 Document Analysis (₹100) - AI-powered legal document review, 🛡️ Risk Assessment (₹80) - Comprehensive legal risk evaluation, 💬 Legal Consultation (₹150) - Expert advice sessions. Which service would you like to know more about?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Default response
    return 'I understand you have a legal question. Our AI system can help with document analysis, risk assessment, and connecting you with legal experts. For specific legal matters, I recommend booking a consultation with one of our lawyers. How can I assist you further?';
}

// Document Analysis Functions
function openDocumentAnalysis() {
    const documentModal = document.getElementById('documentModal');
    documentModal.classList.remove('hidden');
    resetDocumentUpload();
}

function closeDocumentAnalysis() {
    const documentModal = document.getElementById('documentModal');
    documentModal.classList.add('hidden');
    resetDocumentUpload();
}

function resetDocumentUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const analysisProgress = document.getElementById('analysisProgress');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (analysisProgress) analysisProgress.classList.add('hidden');
    if (fileInput) fileInput.value = '';
    
    isAnalyzing = false;
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processFileUpload(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = 'var(--color-primary)';
}

function handleDragLeave(event) {
    event.currentTarget.style.borderColor = 'var(--color-border)';
}

function handleFileDrop(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = 'var(--color-border)';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFileUpload(files[0]);
    }
}

function processFileUpload(file) {
    if (isAnalyzing) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx')) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
    }
    
    startDocumentAnalysis(file.name);
}

function startDocumentAnalysis(fileName) {
    isAnalyzing = true;
    
    const uploadArea = document.getElementById('uploadArea');
    const analysisProgress = document.getElementById('analysisProgress');
    
    uploadArea.style.display = 'none';
    analysisProgress.classList.remove('hidden');
    
    simulateAnalysisProgress(fileName);
}

function simulateAnalysisProgress(fileName) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const steps = [
        'Uploading document...',
        'Extracting text content...',
        'Analyzing legal structure...',
        'Identifying key clauses...',
        'Checking compliance requirements...',
        'Evaluating risk factors...',
        'Generating recommendations...',
        'Finalizing report...'
    ];
    
    let currentStep = 0;
    let progress = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress > 100) {
            progress = 100;
            clearInterval(progressInterval);
            completeAnalysis(fileName);
            return;
        }
        
        progressFill.style.width = progress + '%';
        
        if (currentStep < steps.length - 1 && progress > (currentStep + 1) * 12.5) {
            currentStep++;
            progressText.textContent = steps[currentStep];
        }
    }, 800);
}

function completeAnalysis(fileName) {
    const progressText = document.getElementById('progressText');
    progressText.textContent = 'Analysis complete!';
    
    setTimeout(() => {
        showAnalysisResults(fileName);
    }, 1000);
}

function showAnalysisResults(fileName) {
    const analysisProgress = document.getElementById('analysisProgress');
    analysisProgress.innerHTML = `
        <div class="analysis-results">
            <h4>Analysis Complete</h4>
            <div class="result-summary">
                <p><strong>Document:</strong> ${fileName}</p>
                <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Risk Level:</strong> <span class="status status--warning">Medium</span></p>
            </div>
            <div class="result-highlights">
                <h5>Key Findings:</h5>
                <ul>
                    <li>✓ Document structure is legally compliant</li>
                    <li>⚠️ 2 clauses require attention</li>
                    <li>ℹ️ 3 recommendations for improvement</li>
                    <li>✓ No critical risks identified</li>
                </ul>
            </div>
            <div class="result-actions">
                <button class="btn btn--primary" onclick="downloadReport()">Download Full Report</button>
                <button class="btn btn--outline" onclick="closeDocumentAnalysis()">Close</button>
            </div>
        </div>
    `;
}

function downloadReport() {
    // Simulate report download
    alert('Analysis report downloaded successfully! In a real application, this would download a detailed PDF report with findings and recommendations.');
}

// Risk Assessment Functions
function openRiskAssessment() {
    const riskModal = document.getElementById('riskModal');
    riskModal.classList.remove('hidden');
}

function closeRiskAssessment() {
    const riskModal = document.getElementById('riskModal');
    riskModal.classList.add('hidden');
    
    // Reset form
    const riskForm = document.getElementById('riskForm');
    if (riskForm) riskForm.reset();
}

function handleRiskAssessment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Get checked concerns
    const concerns = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Simulate risk calculation
    const riskScore = calculateRiskScore(data, concerns);
    showRiskResults(riskScore, concerns);
}

function calculateRiskScore(data, concerns) {
    let score = 50; // Base score
    
    // Adjust based on business type
    const businessTypeScores = {
        'startup': 15,
        'small-business': 10,
        'corporation': -5,
        'non-profit': 5
    };
    score += businessTypeScores[data.businessType] || 0;
    
    // Adjust based on industry
    const industryScores = {
        'technology': 10,
        'healthcare': 20,
        'finance': 25,
        'retail': 5,
        'manufacturing': 15
    };
    score += industryScores[data.industry] || 0;
    
    // Adjust based on employee count
    const employeeScores = {
        '1-10': 10,
        '11-50': 5,
        '51-200': -5,
        '200+': -10
    };
    score += employeeScores[data.employees] || 0;
    
    // Adjust based on concerns
    score += concerns.length * 5;
    
    return Math.max(0, Math.min(100, score));
}

function showRiskResults(score, concerns) {
    const riskModal = document.getElementById('riskModal');
    const modalContent = riskModal.querySelector('.modal-content');
    
    let riskLevel = 'Low';
    let riskClass = 'success';
    if (score > 60) {
        riskLevel = 'High';
        riskClass = 'error';
    } else if (score > 30) {
        riskLevel = 'Medium';
        riskClass = 'warning';
    }
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Risk Assessment Results</h3>
            <button class="modal-close" onclick="closeRiskAssessment()">&times;</button>
        </div>
        <div class="risk-results" style="padding: var(--space-20);">
            <div class="risk-score">
                <h4>Overall Risk Score</h4>
                <div class="score-display">
                    <span class="score-number">${score}/100</span>
                    <span class="status status--${riskClass}">${riskLevel} Risk</span>
                </div>
            </div>
            <div class="risk-breakdown">
                <h5>Risk Factors:</h5>
                <ul>
                    ${concerns.map(concern => `<li>${formatConcern(concern)}</li>`).join('')}
                </ul>
            </div>
            <div class="recommendations">
                <h5>Recommendations:</h5>
                <ul>
                    <li>Review and update your legal compliance procedures</li>
                    <li>Consider legal insurance for high-risk areas</li>
                    <li>Schedule regular legal health checks</li>
                    <li>Implement proper documentation practices</li>
                </ul>
            </div>
            <div class="result-actions" style="margin-top: var(--space-20);">
                <button class="btn btn--primary" onclick="openConsultationBooking()">Book Consultation</button>
                <button class="btn btn--outline" onclick="closeRiskAssessment()">Close</button>
            </div>
        </div>
    `;
}

function formatConcern(concern) {
    const concernMap = {
        'contracts': 'Contract Management',
        'compliance': 'Regulatory Compliance',
        'intellectual-property': 'Intellectual Property',
        'employment': 'Employment Law',
        'data-protection': 'Data Protection'
    };
    return concernMap[concern] || concern;
}

// Consultation Booking Functions
function openConsultationBooking() {
    const consultationModal = document.getElementById('consultationModal');
    consultationModal.classList.remove('hidden');
}

function closeConsultationBooking() {
    const consultationModal = document.getElementById('consultationModal');
    consultationModal.classList.add('hidden');
    
    // Reset form
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) consultationForm.reset();
}

function handleConsultationBooking(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate booking confirmation
    showBookingConfirmation(data);
}

function showBookingConfirmation(bookingData) {
    const consultationModal = document.getElementById('consultationModal');
    const modalContent = consultationModal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Booking Confirmation</h3>
            <button class="modal-close" onclick="closeConsultationBooking()">&times;</button>
        </div>
        <div class="booking-confirmation" style="padding: var(--space-20);">
            <div class="confirmation-icon" style="text-align: center; font-size: 48px; margin-bottom: var(--space-16);">✅</div>
            <h4 style="text-align: center; margin-bottom: var(--space-16);">Consultation Booked Successfully!</h4>
            <div class="booking-details">
                <p><strong>Name:</strong> ${bookingData.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${bookingData.email || 'N/A'}</p>
                <p><strong>Date:</strong> ${bookingData.date || 'N/A'}</p>
                <p><strong>Time:</strong> ${bookingData.time || 'N/A'}</p>
                <p><strong>Type:</strong> ${bookingData.consultationType || 'N/A'}</p>
            </div>
            <div class="next-steps">
                <h5>Next Steps:</h5>
                <ul>
                    <li>You will receive a confirmation email shortly</li>
                    <li>Our team will contact you 24 hours before the session</li>
                    <li>Please prepare any relevant documents</li>
                    <li>Join the session via the link in your email</li>
                </ul>
            </div>
            <div class="result-actions" style="margin-top: var(--space-20);">
                <button class="btn btn--primary" onclick="closeConsultationBooking()">Close</button>
            </div>
        </div>
    `;
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    alert('Thank you for your message! We will get back to you within 24 hours.');
    event.target.reset();
}

// Utility Functions
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top functionality
window.addEventListener('scroll', () => {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Newsletter subscription (if needed)
function subscribeNewsletter(email) {
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    
    alert('Thank you for subscribing to our newsletter!');
}

// Initialize tooltips or help text (if needed)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    if (tooltipText) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'var(--color-charcoal-800)';
        tooltip.style.color = 'var(--color-white)';
        tooltip.style.padding = 'var(--space-8)';
        tooltip.style.borderRadius = 'var(--radius-base)';
        tooltip.style.fontSize = 'var(--font-size-sm)';
        tooltip.style.zIndex = '9999';
        
        document.body.appendChild(tooltip);
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    }
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Handle keyboard navigation for accessibility
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAllModals();
    }
});

// Performance optimization: Lazy load images (if any were added)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
}
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please choose a file first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    alert(
      `✅ ${data.message}\n\n📄 Word Count: ${data.wordCount}\n📝 Summary:\n${data.summary}`
    );
  } catch (error) {
    alert("❌ Unable to connect to backend. Make sure the server is running!");
    console.error(error);
  }
});
