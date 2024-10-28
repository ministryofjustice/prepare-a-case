
(function setupDateSortComponent() {

  var pacFilterForm = document.getElementById('pac-filter-form');
  var pacFilterCard = document.getElementById('pac-filter-card');

  if (pacFilterForm) {

    //change form method to get
    pacFilterForm.setAttribute('method', 'get');

    //get sort button and add event listener
    var sortButton = document.getElementById('button-hearing-outcome-sort');

    if (sortButton) {
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

      // This is a hack to intercept the form submit when called outside scope (e.g. clear filters)
      var tmp = pacFilterForm.submit;
      pacFilterForm.submit = function () {
        var sortInput = document.getElementById('hidden-hearingDate');
        // test value of sortInput
        if (sortInput.value === 'NONE') {
          // remove from the form
          pacFilterCard.removeChild(sortInput);
        }
        tmp.apply(pacFilterForm);
      }

      sortButton.addEventListener('click', function sortClick() {
        var currentSort = sortButton.getAttribute('data-sort');
        var newSort = simpleStateMachine[currentSort];
        var sortInput = document.getElementById('hidden-hearingDate');
        sortInput.setAttribute('value', sortMapping[newSort]);
        sortButton.setAttribute('data-sort', newSort);
        pacFilterForm.submit();
      })
    }
  }
})()