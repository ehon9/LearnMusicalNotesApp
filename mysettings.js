document.addEventListener('DOMContentLoaded', function() {
    // Restore the selected state from localStorage
    restoreSelectedState();

    // Attach event listener to the form for saving state on change
    var form = document.getElementById('settings');
    if (form) {
        form.addEventListener('change', saveSelectedState);
    }
});

function restoreSelectedState() {
    var form = document.getElementById('settings');
    if (form) {
        var inputs = form.querySelectorAll('input[type="radio"]');
        inputs.forEach(function(input) {
            var storedValue = localStorage.getItem(input.name);
            if (storedValue === input.value) {
                input.checked = true;
            }
        });
    }
}

function saveSelectedState() {
    var form = document.getElementById('settings');
    if (form) {
        var inputs = form.querySelectorAll('input[type="radio"]');
        inputs.forEach(function(input) {
            if (input.checked) {
                localStorage.setItem(input.name, input.value);
            }
        });
    }
}

function goHome() {
    window.location.href = "./main.html";
}

