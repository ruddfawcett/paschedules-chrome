<?php
  $dbopts = parse_url(getenv('DATABASE_URL'));

  $db = new PDO('pgsql:dbname='.ltrim($dbopts["path"],'/').';host='.$dbopts['host'].';user='.$dbopts['user'].';password='.$dbopts['password']);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

?>
