<?php

  $db = new PDO('pgsql:dbname=dda7aktten0s5n;host=ec2-54-163-233-201.compute-1.amazonaws.com;user=lodjyozkmgaitp;password=c9e0fd1c8b1d52ddc13ac91cd45303c7d15c4a9b95335ca0892ea472e1d0ef3b');
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

?>
