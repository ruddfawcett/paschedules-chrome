// Scraping madness.

var establishUser = function() {
  Log('Establishing and scraping user information.');

  var P = $.Deferred();

  var name = $('#cphBody_lblNameValue').text();
  var first = name.split(' ')[0];
  var email = $('#cphBody_lblEmailValue').text();
  var id = $('#cphBody_lblIdValue').text();
  var grad = $('#cphBody_lblClassValue').text();

  if (name.length && email.length && id.length && grad.length) {
    LS.set('student_name', name);
    LS.set('student_email', email);
    LS.set('student_id', id);
    LS.set('student_grad', grad);

    Notification.show(`Hi, ${first}! Thanks for using PASchedules.`, 'information');

    P.resolve();
  }

  return P.promise();
};

// Scraping schedules.

var parseSchedule = function() {
  Log('Scraping schedule and flitering classes.');

  var P = $.Deferred();

  var $rows = $('table#cphBody_tblGrid tr');
  var courses = [];

  // Iterate through each row (skip day headers: 0 and after school: 11).
  $rows.each(function(i, row) {
    if (i == 0 || i == 11) {
      return true;
    }

    $cells = $(row).find('td');
    $cells.each(function(j, cell) {
      // Skip the white and blue cells (non class blocks).
      var bg = $(cell).css('background-color');
      if (bg == 'rgb(255, 255, 255)' || bg == 'rgb(58, 167, 248)') {
        return true;
      }
      // Skip free periods or lunches.
      if ($($(cell).find('span')[0]).text().trim() == '') {
        return true;
      }

      var metadata = parseCourse(cell, j);

      return courses.push(metadata);
    });
  }).promise().done(function() {
    P.resolve(courses);
    Log('Courses parsed.');
  });

  return P.promise();
}

var syncData = function(courses) {
  Log('Syncing schedule with server.');

  var P = $.Deferred();

  Notification.show('Syncing your schedule.', 'warning', false);

  var post_data = {
    student: {
      id: LS.get('student_id'),
      name: LS.get('student_name'),
      email: LS.get('student_email'),
      grad: LS.get('student_grad')
    },
    "courses": courses,
    version: "0.2"
  };

  $.ajax({
    url: 'https://paschedules.herokuapp.com/sync.php?v=2',
    type: 'POST',
    data: {data: post_data},
    success: function (result) {
      $.noty.closeAll();
      Log('Schedule successfully synced.');
      Notification.show('Your schedule was synced!', 'success');
      P.resolve();
    },
    error: function(XMLHttpRequest, textStatus, error) {
      $.noty.closeAll();
      Log(`POSTing failed. Status: ${textStatus}. Error: ${error}`);
      Notification.show('Unable to sync your schedule.', 'error');
      P.reject(error);
    }
  });

  return P.promise();
};

establishUser().then(parseSchedule).then(syncData).done(function() {
  Log('Our work here is done.');
}).catch(function(error) {
  Log('An unexpected error occurred. Error:');
  Log(error);
});
