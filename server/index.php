<?php require('includes/header.php'); ?>

<h1>PASchedules</h1>

<?php if (isset($_GET['v'])): ?>
<h3>Click on a class to get started.</h3>
<?php else: ?>
<?php require('includes/update.php') ?>
<?php endif; ?>

<?php require('includes/footer.php') ?>
