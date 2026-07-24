
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

    var sortConfig = [
      {
        buttonId: 'button-defendant-sort',
        inputId: 'hidden-defendantName',
        sortId: 'defendantName'
      },
      {
        buttonId: 'button-probation-status-sort',
        inputId: 'hidden-probationStatus',
        sortId: 'probationStatus'
      },
      {
        buttonId: 'button-hearing-outcome-sort',
        inputId: 'hidden-hearingDate',
        sortId: 'hearingDate'
      }
    ]

    var availableSorts = sortConfig.filter(function (config) {
      return document.getElementById(config.buttonId)
    })

    function getOrCreateSortInput(config) {
      var sortInput = document.getElementById(config.inputId)
      if (sortInput) {
        return sortInput
      }

      sortInput = document.createElement('input')
      sortInput.setAttribute('type', 'hidden')
      sortInput.setAttribute('id', config.inputId)
      sortInput.setAttribute('name', config.sortId)
      sortInput.setAttribute('value', sortMapping.none)
      pacFilterCard.appendChild(sortInput)
      return sortInput
    }

    var tmp = pacFilterForm.submit;
    pacFilterForm.submit = function () {
      sortConfig.forEach(function (config) {
        var sortInput = document.getElementById(config.inputId)
        if (sortInput && sortInput.value === 'NONE' && sortInput.parentElement === pacFilterCard) {
          pacFilterCard.removeChild(sortInput)
        }
      })
      tmp.apply(pacFilterForm)
    }

    availableSorts.forEach(function (activeSortConfig) {
      var sortButton = document.getElementById(activeSortConfig.buttonId)
      var sortInput = getOrCreateSortInput(activeSortConfig)

      sortButton.addEventListener('click', function sortClick() {
        var currentSort = sortButton.getAttribute('data-sort')
        var newSort = simpleStateMachine[currentSort]

        availableSorts.forEach(function (config) {
          var input = config.inputId === activeSortConfig.inputId
            ? sortInput
            : document.getElementById(config.inputId)
          var button = document.getElementById(config.buttonId)
          if (!button) {
            return
          }

          if (config.inputId === activeSortConfig.inputId) {
            input.setAttribute('value', sortMapping[newSort])
            button.setAttribute('data-sort', newSort)
          } else if (input) {
            input.setAttribute('value', sortMapping.none)
            button.setAttribute('data-sort', 'none')
          } else {
            button.setAttribute('data-sort', 'none')
          }
        })

        pacFilterForm.submit()
      })
    })
  }
})()