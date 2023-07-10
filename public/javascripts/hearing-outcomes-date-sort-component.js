
(function setupDateSortComponent () {

  var pacFilterForm = document.getElementById('pac-filter-form');

  if (pacFilterForm) {

    //change form method to get
    pacFilterForm.setAttribute('method', 'get');

    //get sort button and add event listener
    var sortButton = document.getElementById('button-hearing-outcome-sort');

    if (sortButton) {      var simpleStateMachine = {
        none: 'ascending',
        ascending: 'descending',
        descending: 'none'
      }
      sortButton.addEventListener('click', () => {
        var currentSort = sortButton.getAttribute('data-sort');
        var newSort = simpleStateMachine[currentSort];
        sortButton.setAttribute('data-sort', newSort);
        var sortInput = document.getElementById('hidden-hearingDate');
        sortInput.setAttribute('value', newSort);
        pacFilterForm.submit();
      })
    }
  }
})()