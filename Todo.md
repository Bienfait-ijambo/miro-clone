
MIRO CLONE


______________________________________
INSTALLATION

1. Laravel

2. php artisan install:api

3. php artisan install:broadcasting. 

	- you will be prompted to install == laravel reverb ==
	- This command install  ==laravel-echo and pusher-js ==

4. publish  reverb config file -> php artisan reverb:install

5. next type "npm run build" to compile your application's assets

--------------------------------  FRONTED SETUP

1. npm i -D @vitejs/plugin-vue

1. npm i vue@latest

2. npm i vue-router@4

3. npm i -D typescript vue-tsc 

4. create tsconfig.ts file

4. tailwind css

---------------------------------------------------------------


DATABASE STRUCTURE 
users 
	- name
	- email
	- googleId
	  endpoints : [login/create]


projects
	- name
	- image
	- projectCode (uniqueId str 10)
	- userId (project owner)
	- projectLink


[StickyNote,Drawing,MiniTextEditor,TextCaption]

projectStickyNote
	- projectId
	- stickyNoteData (json)
	
	 $table->integer('projectId');
     $table->json('stickyNoteData');
	
projectDrawing
	- projectId
	- drawingData (json)

	 $table->integer('projectId');
     $table->json('drawingData');

	
projectMiniTextEditor
	- projectId
	- editorData (json)

	 $table->integer('projectId');
     $table->json('editorData');

projectTextCaption
	- projectId
	- textCaptionData (json)

	 $table->integer('projectId');
     $table->json('textCaptionData');

projectJoinees
	- projectId
	- userId (joinee)

	 $table->integer('projectId');
	 $table->integer('userId');
