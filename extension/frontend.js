$(function() {
  $('<div />', {
    class: 'pas-iframe-container'
  }).appendTo('.col-md8');

  $('<iframe />', {
    class: 'pas-iframe',
    src: 'https://paschedules.herokuapp.com/'
  }).appendTo('.pas-iframe-container');

  var bgs = [
    'rgb(255, 255, 255)',
    'rgb(58, 167, 248)'
  ]

  $('table#cphBody_tblGrid td').hover(function () {
      if ($.inArray($(this).css('background-color'), bgs) == -1 && $($(this).find('span')[0]).text().trim() != '') {
        $(this).addClass('active');
      }
    },
    function() {
      $(this).removeClass('active');
    }
  );

  $('table#cphBody_tblGrid td').on('click', function() {
    if ($.inArray($(this).css('background-color'), bgs) > -1 || $($(this).find('span')[0]).text().trim() == '') {
      return;
    }

    var course_info = parseCourse(this, $(this).index());
    var course_id = course_info['course_id'];

    $('.pas-iframe').attr('src', `https://paschedules.herokuapp.com/roster.php?course=${course_id}`);
  });

});
