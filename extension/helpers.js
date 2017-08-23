// Helpers

var Notification = {
  show: function(text, type) {
    return self.show(text, type, 5000);
  },
  show: function(text, type, timeout) {
    return self.show(text, type, timeout, null);
  },
  show: function(text, type, timeout, cb) {
    return noty({
      theme: 'relax',
      layout: 'topRight',
      text: text,
      timeout: timeout || timeout == null ? 5000 : timeout,
      type: type
    });
  }
}

var Log = function(obj) {
  if (typeof obj === 'string') {
    console.log(`[PASchedules] ${obj}`);
    return;
  }
  console.log('[PASchedules]', obj);
}

var LS = {
  prepend: 'paschedules-',
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

var parseCourse = function(cell, day) {
  var period = $($(cell).find('div')[0]).text().trim().replace(' ', '');
  var course = $($(cell).find('span')[0]).text().trim().replace(' ', '');
  var teacher = $($(cell).find('span')[1]).text().trim();
  var room = $($(cell).find('span')[2]).text().trim().replace(' ', '');

  var course_id = `${course}-${teacher.replace(' ', '')}-${room}-${day}-${period}`;
  course_id = course_id.toLowerCase();

  return {
    "course_id": course_id,
    "course_code": course,
    "course_room": room,
    "teacher_name": teacher
  };
}
