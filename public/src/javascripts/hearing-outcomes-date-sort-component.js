
(function setupDateSortComponent() {

  var pacFilterForm = document.getElementById('pac-filter-form');
  var pacFilterCard = document.getElementById('pac-filter-card');

  if (pacFilterForm) {

    //change form method to get
    pacFilterForm.setAttribute('method', 'get');

    var simpleStateMachine = {
      none: 'ascending',
      ascending: 'descending',
      descending: 'none'
    }

    var sortMapping = {
      none: 'NONE',
      ascending: 'ASC',
      descending: 'DESC'
    }

    var sortConfigs = [
      {
        buttonId: 'button-hearing-outcome-sort',
        inputId: 'hidden-hearingDate'
      },
      {
        buttonId: 'button-hearing-outcome-defendant-sort',
        inputId: 'hidden-defendantName'
      },
      {
        buttonId: 'button-hearing-outcome-probation-status-sort',
        inputId: 'hidden-probationStatus'
      }
    ]

    function getOrCreateSortInput(inputId, inputName) {
      var input = document.getElementById(inputId);
      if (!input) {
        input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('id', inputId);
        input.setAttribute('name', inputName);
        input.setAttribute('value', 'NONE');
        pacFilterCard.appendChild(input);
      }
      return input;
    }

    // This is a hack to intercept the form submit when called outside scope (e.g. clear filters)
    var tmp = pacFilterForm.submit;
    pacFilterForm.submit = function () {
      sortConfigs.forEach(function cleanupSortInput(config) {
        var sortInput = document.getElementById(config.inputId);
        if (sortInput && sortInput.value === 'NONE' && pacFilterCard.contains(sortInput)) {
          pacFilterCard.removeChild(sortInput);
        }
      })
      tmp.apply(pacFilterForm);
    }

    sortConfigs.forEach(function setupSortButton(config) {
      var sortButton = document.getElementById(config.buttonId);
      if (!sortButton) {
        return;
      }

      sortButton.addEventListener('click', function sortClick() {
        var currentSort = sortButton.getAttribute('data-sort') || 'none';
        var newSort = simpleStateMachine[currentSort];
        var inputName = config.inputId.replace('hidden-', '');
        var sortInput = getOrCreateSortInput(config.inputId, inputName);

        sortConfigs.forEach(function resetOtherSorts(otherConfig) {
          if (otherConfig.inputId === config.inputId) {
            return;
          }

          var otherInputName = otherConfig.inputId.replace('hidden-', '');
          var otherSortInput = getOrCreateSortInput(otherConfig.inputId, otherInputName);
          var otherSortButton = document.getElementById(otherConfig.buttonId);

          otherSortInput.setAttribute('value', 'NONE');
          if (otherSortButton) {
            otherSortButton.setAttribute('data-sort', 'none');
          }
        })

        sortInput.setAttribute('value', sortMapping[newSort]);
        sortButton.setAttribute('data-sort', newSort);
        pacFilterForm.submit();
      })
    })
  }
})()