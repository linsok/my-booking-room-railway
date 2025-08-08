// CSRF setup
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// Toggle forms
document.getElementById('show-signup').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
});
document.getElementById('show-login').addEventListener('click', () => {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
});
document.getElementById('show-forgot').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
});

// Login form submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        alert('Login successful');
        // TODO: Redirect or save token here
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
});

// Signup form submit
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-password2').value;
    const phone = document.getElementById('phone').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/auth/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                username: email,
                email,
                password1: password,
                password2: confirmPassword,
                phone,
                name
            })
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        const data = await response.json();
        alert('Signup successful');
        document.getElementById('signup-form').reset();
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed');
    }
});

// Forgot Password Step 1
document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-contact').value;

    try {
        const response = await fetch('/api/password_reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Request failed');
        }

        alert('Reset code sent to email');
        document.getElementById('forgot-password-form').classList.add('hidden');
        document.getElementById('reset-code-container').classList.remove('hidden');
    } catch (error) {
        console.error('Reset request error:', error);
        alert('Error sending reset code');
    }
});

// Forgot Password Step 2 (Verify code)
document.getElementById('reset-code-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('reset-code-input').value;

    try {
        const response = await fetch('/api/password_reset/validate_token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ token: code })
        });

        if (!response.ok) {
            throw new Error('Invalid code');
        }

        alert('Code verified. You can now set a new password.');
        document.getElementById('reset-code-container').classList.add('hidden');
        document.getElementById('set-password-container').classList.remove('hidden');

        // Store email for setting password
        document.getElementById('reset-code-email').value = document.getElementById('reset-contact').value;
        document.getElementById('set-password-email').value = document.getElementById('reset-contact').value;
        document.getElementById('set-password-token').value = code;
    } catch (error) {
        console.error('Code validation error:', error);
        alert('Invalid or expired code');
    }
});

// Forgot Password Step 3 (Set new password)
document.getElementById('set-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('set-password-input').value;
    const confirmNewPassword = document.getElementById('set-password-confirm-input').value;
    const token = document.getElementById('set-password-token').value;

    if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/password_reset/confirm/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ token, password: newPassword })
        });

        if (!response.ok) {
            throw new Error('Password reset failed');
        }

        alert('Password reset successful');
        document.getElementById('set-password-form').reset();
        document.getElementById('set-password-container').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    } catch (error) {
        console.error('Password reset error:', error);
        alert('Password reset failed');
    }
});
