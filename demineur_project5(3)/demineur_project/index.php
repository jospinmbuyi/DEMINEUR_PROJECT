<?php
//project demineur
//inscription
session_start();

require('src/connection.php');

if(!empty($_POST['pseudo']) && !empty($_POST['email']) && !empty($_POST['password']) && !empty($_POST['password_confirm'])){
    
    // VARIABLES
    $pseudo           = $_POST['pseudo'];
    $email            = $_POST['email'];
    $password         = $_POST['password'];
    $password_confirm = $_POST['password_confirm'];


    // TEST SI PASSWORD = PASSWORD_CONFIRM

    if($password != $password_confirm){
        header('location: ../?error=1&pass=1');
    }

    // TEST SI L'EMAIL EST UTILISE

    $req = $db->prepare("SELECT count(*) as numberEmail FROM users WHERE email = ?");
    $req->execute(array($email));

     while($email_verification = $req->fetch()){
         if($email_verification ['numberEmail'] != 0) {
             header('location: ../?error=12&email=12');
         }
     }

     // HASH
     $secret = sha1($email).time();
     $secret = sha1($secret).time().time();

     // PASSWORD CRYPTAGE
     $password = "aq1".sha1($password."1245"). "25";
    
    //  ENVOI DE LA REQUETE DE LA BASE DE DONNEE

    $req = $db->prepare("INSERT INTO users(pseudo, email, password, secret) VALUES(?, ?, ?, ? )");
    $req-> execute(array($pseudo, $email, $password, $secret ));

    header('location: ../?success=1');

}

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset ="UTF-8"/>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <title>demineur project</title>
    </head>
    <body>
        <header>
              <h1>Inscription</h1>
        </header>

        <div class="container">

          <?php
           if(!isset($_SESSION['connect'])){ ?>
          
           <p id="info"> Bienvenue dans notre site veuillez vous connectez. <a href="connection.php">connectez-vous</a>.</p>

           <?php
               if(isset($_GET['error'])){
                   if(isset($_GET['pass'])){
                       echo'<p id="error"> vos mots de passe ne correspond pas</p>';

                   }
                   else if(isset($_GET['email'])){
                       echo'<p id="error"> votre adresse existe déjà.</p>';
                   }
               }
               else if(isset($_GET['success'])){
                   echo'<p id="success">Inscription réussi.</p>';
               }
           ?>

           <div id="form">
       
          <form method="post" action="index.php">
            <table>
                <tr>
                    <td>pseudo</td>
                    <td><input type="text" name="pseudo" placeholder="pseudo" required></td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><input type="email" name="email" placeholder="example@gmail.com" required></td>
                </tr>
                <tr>
                    <td>Mot de passe</td>
                    <td><input type="password" name="password" placeholder="*******" required></td>
                </tr>
                <tr>
                    <td>confirmer mot de passe</td>
                    <td><input type="password" name="password_confirm" placeholder="****" required></td>
                </tr>
            </table>
            <div id="button">
             <button> inscription</button>
            </div>


           </form>
         </div>
       <?php } else { ?>
        <p id="info">👤: <?= $_SESSION['pseudo'] ?><br>
        <a href="disconnection.php">Déconnexion</a>
        </p>
       <iframe name="iframeSite_accueil" id="iframeSite_accueil" scrollbar="no" marginheight="0" marginwidth="0" src="mini_prj_demineur_v1.1\index.html" width="100%" height="800px" frameborder="no"></iframe> 
        <?php }?>
        </div>
        
    </body>
</html>