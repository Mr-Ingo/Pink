var mainHeader = document.querySelector('.mainHeader');
var mainHeader__toggle = document.querySelector('.mainHeader__toggle');

mainHeader.classList.remove('mainHeader--nojs');

mainHeader__toggle.addEventListener('click', function(){
  if (mainHeader.classList.contains('mainHeader--navClosed')) {
    mainHeader.classList.remove('mainHeader--navClosed');
    mainHeader.classList.add('mainHeader--navOpened');
  } else {
    mainHeader.classList.add('mainHeader--navClosed');
    mainHeader.classList.remove('mainHeader--navOpened');
  }
});
