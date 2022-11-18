<?php
//project demineur
session_start();
//connection
if(isset($_SESSION['connect'])){
  header('location:../');
}

require('src/connection.php');

if(!empty($_POST['pseudo']) && !empty($_POST['password'])){

  // VARIABLES
  $pseudo  = $_POST['pseudo'];
  $password = $_POST['password'];
  $error  = 1;

  //CRYPTER LE PASSWORD
  $password = "aq1".sha1($password."1245"). "25";
  

  $req = $db->prepare('SELECT * FROM users WHERE pseudo = ?');
  $req->execute(array($pseudo));

  while($user = $req->fetch()){
    
    if($password == $user['password']){
      $error = 0;
      $_SESSION['connect'] = 1;
      $_SESSION['pseudo'] = $user['pseudo'];

      if(isset($_POST['connect'])){
        setcookie('log', $user['secret'], time() + 365*24*3600, '/', null, false,true);
      }
      header('location: ../connection.php?success=1');

    }

  }
  if($error == 1){
    header('location: ../connection.php?error=1');
  }
}

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset ="UTF-8"/>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <title>connexion</title>
    </head>
    <body>  
        <header>    
             <h1>Connexion</h1>
        </header>

      <div class="container">
          <p id="info">  Welcome dans notre site veillez vous inscrire. alors, <a href="../">inscrivez-vous</a>.</p>

          <?php
          if(isset($_GET['error'])){
            echo'<p id="error">Vous pouvez pas vous authentifier.</p>';
          }
          else if(isset($_GET['success'])){
            echo'<p id="success"> Vous êtes connecté.</p>';
          }
          
          ?>

          <div id="form">
       
          <form method="post" action="connection.php">
            <table>
                <tr>
                    <td>pseudo</td>
                    <td><input type="text" name="pseudo" placeholder="Ex : pseudo" required></td>
                </tr>
                
                <tr>
                    <td>Mot de passe</td>
                    <td><input type="password" name="password" placeholder="EX : *******" required></td>
                </tr>
                
            </table>
            <p><label><input type="checkbox" name="connect" checked>Connexion automatique</label></p>
            <div id="buttom">
               <button> connexion</button>
             </div>

           </form>
         </div>
      </div> 
        
    </body>
</html>