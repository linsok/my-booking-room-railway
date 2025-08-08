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
document.getElementById('showSignup').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
});
document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});
document.getElementById('showForgotPassword').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.remove('hidden');
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

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
        // Redirect or save token if needed
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
});

// Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const phone = document.getElementById('signupPhone').value;

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
        document.getElementById('signupForm').reset();
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed');
    }
});

// Forgot Password Step 1
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;

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
        document.getElementById('forgotPasswordForm').classList.add('hidden');
        document.getElementById('resetCodeForm').classList.remove('hidden');
    } catch (error) {
        console.error('Reset request error:', error);
        alert('Error sending reset code');
    }
});

// Forgot Password Step 2 (Verify code)
document.getElementById('resetCodeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('resetCode').value;

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
        document.getElementById('resetCodeForm').classList.add('hidden');
        document.getElementById('newPasswordForm').classList.remove('hidden');
    } catch (error) {
        console.error('Code validation error:', error);
        alert('Invalid or expired code');
    }
});

// Forgot Password Step 3 (Set new password)
document.getElementById('newPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const token = document.getElementById('resetCode').value;

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
        document.getElementById('newPasswordForm').reset();
        document.getElementById('newPasswordForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    } catch (error) {
        console.error('Password reset error:', error);
        alert('Password reset failed');
    }
});
