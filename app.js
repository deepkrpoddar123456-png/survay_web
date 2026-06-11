// 1. Authorized Name Matrix (All registry names must be strictly lowercase)
const masterRegistry = [
    "rahul sharma", 
    "priya das", 
    "amit sen", 
    "sneha roy",
    "joydeep kundu"
];

// Document Object Model Element Selectors
const targetForm = document.getElementById('submissionForm');
const usernameField = document.getElementById('username');
const notificationArea = document.getElementById('statusBox');
const submitButton = document.getElementById('submitBtn');

// 2. Client Browser Verification Lock Check State
function verifyBrowserIdentity() {
    if (localStorage.getItem('portal_submission_lock') === 'true') {
        targetForm.classList.add('hidden');
        notificationArea.className = "status-box error";
        notificationArea.innerHTML = "<strong>Access Warning:</strong> A verified form submission has already been logged from this machine. Duplicate records cannot be processed.";
    }
}

// Fire the identity verification sequence on document initialization
verifyBrowserIdentity();

// 3. Form Interception Pipeline
targetForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop default HTML standard route refreshes

    const inputNameClean = usernameField.value.trim().toLowerCase();

    // Check A: Cross-match string entry with your immutable array data matrix
    if (!masterRegistry.includes(inputNameClean)) {
        notificationArea.className = "status-box error";
        notificationArea.textContent = "Authentication Failed: The provided name is not present in the master registration log.";
        return;
    }

    // Reset layout UI messages for active streaming processing state
    notificationArea.style.display = "none";
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Processing Stream...";
    submitButton.disabled = true;

    // Check B: Marshal form dataset key-value indices into JSON format string mapping
    const operationalData = new FormData(targetForm);
    const dataObject = Object.fromEntries(operationalData);
    const jsonPayload = JSON.stringify(dataObject);

    // Stream out transaction asynchronously to Web3Forms Cloud Infrastructure
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: jsonPayload
    })
    .then(async (response) => {
        let executionResult = await response.json();
        
        if (response.status === 200) {
            // Execution Success Path: Append Client Device Lock and Update DOM Components
            localStorage.setItem('portal_submission_lock', 'true');
            targetForm.classList.add('hidden');
            notificationArea.className = "status-box success";
            notificationArea.innerHTML = "<strong>Data Logged Successfully!</strong><br>Your information has been verified and securely transmitted to the master ledger.";
        } else {
            // Processing Error Response Paths
            notificationArea.className = "status-box error";
            notificationArea.textContent = "Network Error: " + executionResult.message;
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    })
    .catch(error => {
        // Complete Link Fault Fallbacks
        notificationArea.className = "status-box error";
        notificationArea.textContent = "System Exception: Connection to cloud ingest pipeline timed out.";
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
});