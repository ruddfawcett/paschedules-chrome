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

var buildProfile = function() {
  var P = $.Deferred();
  $(document).arrive('#panel-1047_header_hd-textEl', () => {
    Log('Personal data tab exists.');

    var name = $(($('.x-form-display-field')[0])).text().replace('Surname :', '').trim();
    var email = $(($('.x-form-display-field')[5])).text().replace('E-mail :', '').trim();

    if (name.length && email.length) {
      LS.set('name', name);
      LS.set('email', email);

      $('#menu_7').click();
    }

    P.resolve();
  });

  return P.promise();
};

var waitForCalendar = function() {
  var P = $.Deferred();
  $(document).arrive('iframe[src^="/extranet/Student/Calendar/Display"]', () => {
    $('iframe[src^="/extranet/Student/Calendar/Display"]').on('load', function() {
      Log('Calendar iFrame loaded.');
      var notyShown = false;

      var check = setInterval(() => {
        var contents = $('iframe[src^="/extranet/Student/Calendar/Display"]').contents();

        var days = contents.find('.fc-event-container');
        var classes = contents.find('.fc-title');

        if (days.length != 7 || classes.length == 0) {
          if (!notyShown) {
            Notification.show('Navigate to a full, weekly schedule of classes to begin syncing your schedule.', 'warning');
            notyShown = true;
          }
        }
        else {
          Log('Loaded a week with classes.');
          clearInterval(check);
          P.resolve(contents);
        }
      }, 100);
    });
  });

  return P.promise();
}

// Parsing schedules.

var parseSchedule = function(contents) {
  Log('Parsing classes.');
  $.noty.closeAll();
  var P = $.Deferred();

  var days = contents.find('.fc-event-container');
  Notification.show(`Found ${contents.find('.fc-title').length} events on your calendar to parse.`, 'information');

  var courses = [];

  $.each(days, (d, day) => {
    $.each($(day).find('a'), (c, day) => {
      var name = $(day).find('.fc-title').text();
      var parts = name.split(' - ');

      var addTimeToCourse = function(course) {
        var range = $(day).find('.fc-time').text();
        var times = range.split(' - ');

        courses[course].days[d.toString()] = {
          start: times[0],
          end: times[1]
        };
      }

      if (parts[0] in courses) {
        addTimeToCourse(parts[0]);
      }
      else {
        courses[parts[0]] = {
          name: parts[1],
          teacher: parts[2],
          days: {}
        };
        addTimeToCourse(parts[0]);
      }
    });
  });

  P.resolve(courses);
  return P.promise();
}

var flattenCourses = function(courses) {
  var P = $.Deferred();
  Log('Flattening courses.');
  var newCourses = [];

  for (k in courses) {
    var course = courses[k];
    course.code = k;
    newCourses.push(course);
  }

  P.resolve(newCourses);
  return P.promise();
}

var buildStudent = function(courses) {
  var student = {
    name: LS.get('name'),
    email: LS.get('email'),
    courses: courses
  };

  Log(student);
}

buildProfile().then(waitForCalendar).then(parseSchedule).then(flattenCourses).then(buildStudent);
