document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const toggleVisibility = document.getElementById('toggleVisibility');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const scoreText = document.getElementById('scoreText');
    const feedback = document.getElementById('feedback');

    // Requirement Elements
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    // Toggle Password Visibility
    toggleVisibility.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Simple toggle for icon opacity/color as visual cue
        if(type === 'text') {
            toggleVisibility.style.color = 'var(--primary-accent)';
        } else {
            toggleVisibility.style.color = 'var(--text-secondary)';
        }
    });

    // Main event listener for password input
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        const result = checkPasswordStrength(val);
        updateUI(result);
    });

    function checkPasswordStrength(password) {
        let score = 0;
        let requirements = {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false
        };
        let feedbackMsgs = [];

        if (password.length === 0) {
            return { score: 0, requirements, text: 'None', feedback: 'Enter a password to begin analysis.' };
        }

        // 1. Length Check
        if (password.length >= 8) {
            requirements.length = true;
            score += 20;
            if (password.length >= 12) {
                score += 10; // Bonus for long passwords
            }
        } else {
            feedbackMsgs.push("Password should be at least 8 characters.");
        }

        // 2. Uppercase Check
        if (/[A-Z]/.test(password)) {
            requirements.uppercase = true;
            score += 15;
        } else {
            feedbackMsgs.push("Add an uppercase letter.");
        }

        // 3. Lowercase Check
        if (/[a-z]/.test(password)) {
            requirements.lowercase = true;
            score += 15;
        } else {
            feedbackMsgs.push("Add a lowercase letter.");
        }

        // 4. Number Check
        if (/[0-9]/.test(password)) {
            requirements.number = true;
            score += 15;
        } else {
            feedbackMsgs.push("Include at least one number.");
        }

        // 5. Special Character Check
        if (/[^A-Za-z0-9]/.test(password)) {
            requirements.special = true;
            score += 25;
        } else {
            feedbackMsgs.push("Use a special character (e.g., !, @, #, $).");
        }

        // Cap score at 100
        score = Math.min(score, 100);

        // Determine Text and Color Category
        let text = 'None';
        if (score > 0 && score <= 30) text = 'Very Weak';
        else if (score > 30 && score <= 60) text = 'Weak';
        else if (score > 60 && score <= 80) text = 'Good';
        else if (score > 80 && score <= 99) text = 'Strong';
        else if (score === 100) text = 'Very Strong';

        // Provide smart feedback
        let finalFeedback = feedbackMsgs.length > 0 ? feedbackMsgs[0] : "Your password is highly secure!";

        return { score, requirements, text, feedback: finalFeedback };
    }

    function updateUI(result) {
        // Update Bar Width
        strengthBar.style.width = `${result.score}%`;

        // Update Colors
        if (result.score === 0) strengthBar.style.backgroundColor = 'transparent';
        else if (result.score <= 30) strengthBar.style.backgroundColor = 'var(--strength-0)';
        else if (result.score <= 60) strengthBar.style.backgroundColor = 'var(--strength-1)';
        else if (result.score <= 80) strengthBar.style.backgroundColor = 'var(--strength-2)';
        else if (result.score <= 99) strengthBar.style.backgroundColor = 'var(--strength-3)';
        else strengthBar.style.backgroundColor = 'var(--strength-4)';

        // Update Text
        strengthText.innerHTML = `Strength: <strong style="color: ${strengthBar.style.backgroundColor}">${result.text}</strong>`;
        scoreText.innerText = `${result.score}/100`;

        // Update Requirements
        toggleReqClass(reqLength, result.requirements.length);
        toggleReqClass(reqUppercase, result.requirements.uppercase);
        toggleReqClass(reqLowercase, result.requirements.lowercase);
        toggleReqClass(reqNumber, result.requirements.number);
        toggleReqClass(reqSpecial, result.requirements.special);

        // Update Feedback
        feedback.innerText = result.feedback;
    }

    function toggleReqClass(el, isMet) {
        if (isMet) {
            el.classList.add('met');
            el.classList.remove('unmet');
        } else {
            el.classList.add('unmet');
            el.classList.remove('met');
        }
    }
    
    // Initial UI Setup
    updateUI(checkPasswordStrength(''));
});
