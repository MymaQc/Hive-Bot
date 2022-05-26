@ECHO OFF
CLS
TITLE HiveBot
NODE Main

:LOOP
ECHO Le bot redémarrera dans 5 secondes, appuyez sur N pour annuler.
choice /t 5 /c yn /cs /d y /m "Démarrer le bot ?"
IF errorlevel 3 GOTO :YES
IF errorlevel 2 GOTO :NO
IF errorlevel 1 GOTO :YES

:YES
CLS
TITLE HiveBot
NODE Main
GOTO :LOOP

:NO
PAUSE