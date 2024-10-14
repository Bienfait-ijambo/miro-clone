<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1 align="center">EVENT DELEGATION</h1>

    <ul id="list">
        <li id="add-bold" >Item 1</li>
        <li id="add-italic" >Item 2</li>
        <li id="add-underline" >Item 3</li>
    </ul>
    <div contenteditable="true"></div>

    <script>
        document.getElementById('list').addEventListener('click', function(event) {
            // Check if the clicked target is an li
            const attribName = event.target.getAttribute('id')

            if (attribName === 'add-bold') {
                
            } else if (attribName === 'add-italic') {
                // .....
            }
        });
    </script>

</body>

</html>