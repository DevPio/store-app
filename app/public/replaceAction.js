const form = document.querySelector('form.card')

const button = document.querySelector('button.delete')

button.addEventListener('click', _ => {
    form.action = "/products?_method=DELETE"
    form.submit()
})