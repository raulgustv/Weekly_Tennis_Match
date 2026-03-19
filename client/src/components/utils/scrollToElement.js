export const scrollToElement = (el) =>{
    if(!el) return;

    el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}