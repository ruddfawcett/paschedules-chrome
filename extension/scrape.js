// Helpers

var LS = {
  prepend: 'schedsync-',
  get: function(k) {
    var self = this;
    // return $.parseJSON(window.localStorage.getItem(this.prepend+k));
    return window.localStorage.getItem(this.prepend+k);
  },
  set: function(k, v) {
    if (typeof v === 'string') {
      return window.localStorage.setItem(this.prepend+k.toString(), v);
    }
    // return window.localStorage.setItem(this.prepend+k.toString(), JSON.stringify(v));
  }
};

var Notification = {
  show: function(text, type) {
    return self.show(text, type, null);
  },
  show: function(text, type, cb) {
    return noty({
      theme: 'relax',
      layout: 'topRight',
      text: text,
      type: type
    });
  }
}

var Log = function(obj) {
  if (typeof obj === 'string') {
    console.log(`[SchedSync] ${obj}`);
    return;
  }
  console.log('[SchedSync]', obj);
}

// Scraping madness.

var establishUser = function() {
  Log('Parsing user information.');

  var P = $.Deferred();

  var name = $('#cphBody_lblNameValue').text();
  var email = $('#cphBody_lblEmailValue').text();
  var id = $('#cphBody_lblIdValue').text();
  var grad = $('#cphBody_lblClassValue').text();

  if (name.length && email.length && id.length && grad.length) {
    LS.set('name', name);
    LS.set('email', email);
    LS.set('id', id);
    LS.set('grad', grad);

    Notification.show('Finding your student information.', 'information');

    P.resolve();
  }

  return P.promise();
};

// Parsing schedules.

var parseSchedule = function() {
  Log('Parsing schedule and flitering classes.');

  Notification.show('Parsing through your schedule.', 'information');

  var P = $.Deferred();

  var $rows = $('table#cphBody_tblGrid tr');
  var courses = [];

  // Iterate through each row (skip day headers: 0 and after school: 11).
  $rows.each((i, row) => {
    if (i == 0 || i == 11) {
      return true;
    }

    $cells = $(row).find('td');
    $cells.each((j, cell) => {
      // Skip the white and blue cells (non class blocks).
      var bg = $(cell).css('background-color');
      if (bg == 'rgb(255, 255, 255)' || bg == 'rgb(58, 167, 248)') {
        return true;
      }

      if ($($(cell).find('span')[0]).text().trim() == "") {
        return true;
      }

      var period = $($(cell).find('div')[0]).text();
      var course = $($(cell).find('span')[0]).text();
      var teacher = $($(cell).find('span')[1]).text();
      var room = $($(cell).find('span')[2]).text();

      var course_id = `${course}-${teacher}-${room}-${j}-${period}`;

      return courses.push(course_id);
    });
  }).promise().done(() => {
    P.resolve(courses);
  });

  return P.promise();
}

var syncData = function(courses) {
  Log(courses);
};

establishUser().then(parseSchedule).then(syncData);

// .then(flattenCourses).then(buildStudent);
