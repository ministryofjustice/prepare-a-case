
(function setupCaseSearchSortComponent() {

  var button = document.getElementById('button-case-search-next-hearing-sort');
  if (!button) return;

  var stateMachine = {
    descending: 'ascending',
    ascending: 'descending',
    none: 'descending'
  };

  var paramMapping = {
    ascending: 'ASC',
    descending: 'DESC'
  };

  button.addEventListener('click', function () {
    var currentSort = button.getAttribute('data-sort') || 'descending';
    var newSort = stateMachine[currentSort] || 'descending';

    var url = new URL(window.location.href);
    url.searchParams.set('nextHearingDate', paramMapping[newSort]);
    url.searchParams.delete('page');
    window.location.href = url.toString();
  });

})();
