(function setupMatchProbabilityScripts() {
    const radioButtons = document.querySelectorAll('input[name="crn"]');
    const hiddenMatchProbability = document.getElementById('matchProbability');

    function updateMatchProbability() {
        const matchProbability = this.getAttribute('data-match-probability');
        hiddenMatchProbability.value = matchProbability;
    }

    radioButtons.forEach((radio) => {
        radio.addEventListener('change', updateMatchProbability);
    });
})();
