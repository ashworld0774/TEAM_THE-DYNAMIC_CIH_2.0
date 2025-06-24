document.getElementById('verifyForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
  submitBtn.disabled = true;

  try {
    const formData = {
      username: this.username.value.trim(),
      messname: this.messname.value.trim()
    };

    const res = await fetch('/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const result = await res.json();
      
      document.getElementById('popup').style.display = 'flex';
      document.getElementById('details').innerHTML = `
        <p><strong>Mess Owner Name:</strong> ${result.ownerName || 'N/A'}</p>
        <p><strong>Mobile Number:</strong> ${result.mobile || 'N/A'}</p>
        <p><strong>Mess Name:</strong> ${result.messname || 'N/A'}</p>
      `;
    } else {
      const error = await res.json();
      throw new Error(error.message || 'Verification failed');
    }
  } catch (error) {
    alert(error.message || 'There was an error verifying your mess. Please try again.');
    console.error('Verification error:', error);
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
});

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('verifyForm').reset();
}

// Close popup when clicking outside content
document.getElementById('popup').addEventListener('click', function(e) {
  if (e.target === this) {
    closePopup();
  }
});