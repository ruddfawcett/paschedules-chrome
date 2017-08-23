<?php

  require('includes/header.php');

  if (!isset($_GET['course'])) {
    exit();
  }

  $stmt = $db->query("SELECT * FROM paschedules WHERE course_id='".$_GET['course']."'");
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $course = $results[0];

?>

<h1><?php echo $course['course_code']; ?></h1>
<h2><?php echo $course['teacher_name']; ?></h2>
<h3><?php echo $course['course_room']; ?></h3>
<ul class='roster'>
  <?php foreach($results as $result): ?>
    <li><?php echo $result['student_name']; //.' ('.$result['student_grad'].')'?></li>
  <?php endforeach; ?>
</ul>

<?php require('includes/footer.php') ?>
