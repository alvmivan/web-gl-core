// it's like a singleton

export let input = 
{

    isPressed: 
    {
        up : false,
        down : false,
        forward : false,
        back : false,
        left : false,
        right : false,
        space : false,
    },
    mouse:
    {
        horizontal : 0,
        vertical : 0
    }
}

function resetInput()
{
    input.isPressed.up = false;
    input.isPressed.down = false;
    input.isPressed.forward = false;
    input.isPressed.back = false;
    input.isPressed.left = false;
    input.isPressed.right = false;
    input.isPressed.space = false;
}

let mouseX, mouseY;

document.addEventListener('mousemove', (event)=>
{    
    mouseX = (event.movementX);    
    mouseY = (event.movementY);    
})

document.addEventListener('keydown', (event) => 
{    
    switch (event.key) 
    {        
        case ' ':
            input.isPressed.space = true;
        case 'q':
            input.isPressed.down = true;
            break;
        case 'w':
            input.isPressed.forward = true;
            break;
        case 'e':
            input.isPressed.up = true;
            break;
        case 'a':
            input.isPressed.left = true;
            break;
        case 's':
            input.isPressed.back = true;
            break;
        case 'd':
            input.isPressed.right = true;
            break;        
        default:
            break;
    }
})


document.addEventListener('keyup', (event) => 
{    
    switch (event.key) 
    {
        case ' ':
            input.isPressed.space = false;
        case 'q':
            input.isPressed.down = false;
            break;
        case 'w':
            input.isPressed.forward = false;
            break;
        case 'e':
            input.isPressed.up = false;
            break;
        case 'a':
            input.isPressed.left = false;
            break;
        case 's':
            input.isPressed.back = false;
            break;
        case 'd':
            input.isPressed.right = false;
            break;        
        default:
            break;
    }
})



resetInput();