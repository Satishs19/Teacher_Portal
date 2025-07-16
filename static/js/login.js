//function to get CSRF token from cookies
function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        if (cookie.trim().startsWith(name + '=')) {
            return cookie.trim().substring(name.length + 1);
        }
    }
    return null;
}

// Function to validate login
async function validate_login() {
    event.preventDefault(); // Prevent default form submission
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert("✅ Login successful! Redirecting...");
            window.location.href = result.redirect_url;
        } else {
            alert("❌ " + result.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("🚨 Something went wrong.");
    }
}