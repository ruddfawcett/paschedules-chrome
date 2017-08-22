<?php

  $db = new PDO('pgsql:dbname=ruddfawcett;host=localhost;user=ruddfawcett;password=');
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

?>
